const analyzeTicket = async (ticket) => {
    console.log("🤖 AI Agent (Simulation): Analyzing ticket...");

    const text = (ticket.title + " " + ticket.description).toLowerCase();

    const skills = [];
    if (text.includes("react") || text.includes("frontend") || text.includes("ui")) skills.push("React");
    if (text.includes("node") || text.includes("backend") || text.includes("api")) skills.push("Node.js");
    if (text.includes("mongo") || text.includes("database")) skills.push("MongoDB");
    if (text.includes("express")) skills.push("Express");

    // Default skill if none found
    if (skills.length === 0) skills.push("General Support");

    // 2. Simulate Priority Assessment
    let priority = "low";
    if (text.includes("urgent") || text.includes("crash") || text.includes("critical")) priority = "high";
    else if (text.includes("error") || text.includes("bug") || text.includes("fail")) priority = "medium";

    // 3. Simulate Helpful Notes
    const helpfulNotes = `[AI SIMULATION] 
    - Detected Skills: ${skills.join(", ")}
    - Assessed Priority: ${priority.toUpperCase()}
    - Recommendation: Check logs and assign to a specialist in ${skills[0]}.`;

    await new Promise(r => setTimeout(r, 1000));

    return {
        summary: `Automated summary for: ${ticket.title}`,
        priority,
        helpfulNotes,
        relatedSkills: skills
    };
};

export default analyzeTicket;
