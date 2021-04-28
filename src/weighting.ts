/**
 * Calculates the weight of a word based on correct/incorrect count. Higher weight => more frequently shown
 * @param word The word to get the weight of
 * @returns The weight of the word
 */
export function getWordWeight(word: WordDocument): number {
    // Base weight is 20
    let weight = 20 + word.incorrect - word.correct;
    if (weight <= 0)
        weight = 1;
    return weight;
};