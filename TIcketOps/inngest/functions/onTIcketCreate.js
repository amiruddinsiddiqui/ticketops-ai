import { inngest } from '../client.js';
import Ticket from "../../entity/ticket.js";
import User from "../../entity/user.js";
import { sendMail } from "../../utils/mailer.js";
import { NonRetriableError } from 'inngest';
import analyzeTicket from '../../utils/llm.js';

export const onTicketCreated = inngest.createFunction(
    { id: "ticket-created", retries: 2 },
    { event: "ticket/created" },

    async ({ event, step }) => {
        const { ticketId } = event.data;

        const ticket = await step.run("fetch-ticket", async () => {
            const t = await Ticket.findById(ticketId);
            if (!t) throw new NonRetriableError("Ticket not found");
            return t;
        });

        const analysis = await step.run("ai-analysis", async () => {
            return await analyzeTicket(ticket);
        });


        await step.run("update-ticket-metadata", async () => {
            await Ticket.findByIdAndUpdate(ticket._id, {
                status: "IN_PROGRESS",
                priority: analysis.priority,
                helpfulNotes: analysis.helpfulNotes,
                relatedSkills: analysis.relatedSkills
            });
        });


        const assignee = await step.run("assign-moderator", async () => {
    
            let user = await User.findOne({
                role: "moderator",
                skills: { $in: analysis.relatedSkills }
            });


            if (!user) {
                user = await User.findOne({ role: "admin" });
            }

            if (user) {
                await Ticket.findByIdAndUpdate(ticket._id, { assignedTo: user._id });
            }

            return user;
        });


        if (assignee) {
            await step.run("send-email", async () => {
                const updatedTicket = await Ticket.findById(ticket._id);
                await sendMail(
                    assignee.email,
                    `New Ticket Assigned: ${updatedTicket.title}`,
                    `You have been assigned a ticket based on your skills.\n\n` +
                    `Priority: ${analysis.priority}\n` +
                    `Skills Detected: ${analysis.relatedSkills.join(", ")}\n` +
                    `AI Notes: ${analysis.helpfulNotes}`
                );
            });
        }

        return { success: true, assignedTo: assignee?.email || "unassigned" };
    }
);
