import {words} from './words';

const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
const Minimum_Generated = 3;
const filteredWords = words.filter((word) => word.length <= 6);

const generateRandomNumber = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
const generateWord = () => {
    return  filteredWords[generateRandomNumber(0, filteredWords.length)]
};

const shuffleArray = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i+1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

export const generateGameSession = () => {

    const word = generateWord();
    const fillingLetter: string[] = word.split('');
    let scrambledWord: string[] = [];

    const hiddenLetters: string[] = [];
    const hiddenLettersIndex: number[] = [];

    const numberOfLettersToHide = generateRandomNumber(Minimum_Generated, word.length-Minimum_Generated);
    const lettersToHide = new Map<number, string>();
    while(lettersToHide.size !== numberOfLettersToHide) {
        const indexToHide = generateRandomNumber(0, numberOfLettersToHide + 1);
        if(!lettersToHide.has(indexToHide)) {
            const letter = word[indexToHide];
            lettersToHide.set(indexToHide, letter);
        }
    }

    lettersToHide.forEach((value, key) => {
        hiddenLetters.push(value);
        hiddenLettersIndex.push(key);
    });

    fillingLetter.forEach((value, index) => {
        if(hiddenLettersIndex.indexOf(index) >= 0) {
            fillingLetter[index] = '';
        }
    });

    scrambledWord.push(...hiddenLetters);
    while(!(scrambledWord.length === word.length)) {
        const salt = generateRandomNumber(0, 25);
        scrambledWord.push(alphabet[salt]);
    }
    scrambledWord = shuffleArray(scrambledWord);
    return {
        word,
        scrambledWord,
        fillingLetter
    }
}
