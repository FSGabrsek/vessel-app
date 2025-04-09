export const lengthFlavourText = (vessel) => {
    const finished = vessel.status === "finished"
    let text = finished ? vessel.finalLength.toString() : vessel.currentLength.toString()
    switch (vessel.type) {
        case "series":
            text = text.concat(" ", "episodes")
            if (!finished) {
                text = text.concat(" ", `out of ${vessel.finalLength} released`)
            }
            return text
        case "film":
            text = text.concat(" ", "minutes")
            return text
        case "literature":
            text = text.concat(" ", "chapters")
            if (!finished) {
                text = text.concat(" ", `out of ${vessel.finalLength} released`)
            }
            return text
        default:
            return text;
    };
};
