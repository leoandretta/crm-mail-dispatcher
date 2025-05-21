const getGreetings = (): string => {
    const now = new Date();
    const current_hour = now.getHours();
    let message = "";

    if(current_hour < 12) {
        message = "Bom dia";
    } else if(current_hour >= 12 && current_hour < 18) {
        message = "Boa tarde";
    } else {
        message = "Boa noite";
    }

    return message;
    
}

export {
    getGreetings
}