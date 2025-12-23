import { NonRetriableError } from "inngest"
import { inngest } from "../client.js"

import User from "../../entity/user.js"

import { sendMail } from "../../utils/mailer.js"

export const onUserSingup = inngest.createFunction(
    {id: "user-signup", retries: 2},
    {event: "user/signup"},

    async ({event, step}) => {
        try {
            const {email} = event.data
            const user = await step.run("get-user-email", async()=>{
                const userObject = await User.findOne({email})
                if(!userObject){
                    throw new NonRetriableError("User doesnot exist in db")
                }
                return userObject
            })

            await step.run("send-welcom-mail", async () => {
                const subject = `Welcome to the app`
                const message = `Hi, Thanks for signing up`

                await sendMail(user.email, subject, message)
            })

            return {success: true}
        } catch (error) {
            console.error("Something went wrong while running the steps: ", error.message)
            return {success:false}
        }
    }
)