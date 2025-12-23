import { inngest } from "../inngest/client.js";
import Ticket from "../entity/ticket.js"


export const createTicket = async (req, res) => {
    try {
        const { title, description } = req.body
        if (!title || !description) {
            return res.status(401).json({ message: "Title and description are required" })
        }
        const newTicket = await Ticket.create({
            title,
            description,
            createdBy: req.user._id.toString()
        })

        try {
            await inngest.send({
                name: "ticket/created",
                data: {
                    ticketId: newTicket._id.toString(),
                    title,
                    description,
                    createdBy: req.user._id.toString()
                }
            })
        } catch (error) {
            console.error("Inngest ticket event failed:", error.message)
        }
        return res.status(201).json({
            message: "ticket created and processing started",
            ticket: newTicket
        })
    } catch (error) {
        console.error("error creating ticket")
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

export const getTickets = async (req, res) => {
    try {
        const user = req.user
        let tickets = []
        if (user.role !== "user") {
            tickets = await Ticket.find({})
                .populate("assignedTo", ["email", "_id"])
                .populate("createdBy", ["email", "_id"])
                .sort({ createdAt: -1 })
        }
        else {
            tickets = await Ticket.find({ createdBy: user._id })
                .populate("assignedTo", ["email", "_id"])
                .select("title description status createdAt assignedTo createdBy")
                .sort({ createdAt: -1 })
        }
        return res.status(200).json(tickets)
    } catch (error) {
        console.error("error fetching tickets:", error)
        return res.status(500).json({
            message: "Internal server error",
            details: error.message
        })
    }
}


export const getTicket = async (req, res) => {
    try {
        const user = req.user
        let ticket;
        if (user.role !== "user") {
            ticket = await Ticket.findById(req.params.id).populate("assignedTo", ["email", "_id"])
        }
        else {
            ticket = await Ticket.findOne({
                createdBy: user._id,
                _id: req.params.id,
            }).select("title description status createdAt")
        }
        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found" })
        }

        return res.status(200).json(ticket)

    } catch (error) {
        console.error("error fetching ticket")
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

export const updateTicket = async (req, res) => {
    try {
        const { status } = req.body;
        const ticketId = req.params.id;
        const user = req.user;

        const ticket = await Ticket.findById(ticketId);
        if (!ticket) return res.status(404).json({ message: "Ticket not found" });

  
        if (user.role !== 'admin' && ticket.assignedTo?.toString() !== user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to update this ticket" });
        }

        ticket.status = status || ticket.status;
        await ticket.save();

        return res.status(200).json({ message: "Ticket updated", ticket });
    } catch (error) {
        console.error("Error updating ticket:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}