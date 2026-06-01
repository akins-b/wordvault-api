const { Webhook } = require("svix");
const userService = require("../service/userService");

async function handleClerkWebhook(req, res){
    try {
        const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
        const event = webhook.verify(req.body, {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"],
        });

        if (event.type === "user.created"){
            const id = event.data.id;
            const email = event.data.email_addresses?.[0]?.email_address ?? null;
            const username = event.data.username;
            const firstName = event.data.first_name;
            const lastName = event.data.last_name;

            const user = await userService.createUser({id, email, username,firstName, lastName});

            res.status(201).json(user);
        } else if (event.type === "user.updated") {
            const id = event.data.id;
            const email = event.data.email_addresses?.[0]?.email_address ?? null;
            const username = event.data.username || "User";
            const firstName = event.data.first_name;
            const lastName = event.data.last_name;
            
            const user = await userService.updateUser({id, email, username, firstName, lastName});

            res.status(200).json(user);
        } else if (event.type === "user.deleted") {
            const id = event.data.id;
            const user = await userService.deleteUser({id});
            
            res.status(200).json(user);
        } else {
            res.status(200).json({ message: "Event ignored" });
        }
    } catch (error){
        console.log("Error processing webhook: ", error);
        res.status(500).json({message: error.message});
    }
}

module.exports = {
    handleClerkWebhook
}