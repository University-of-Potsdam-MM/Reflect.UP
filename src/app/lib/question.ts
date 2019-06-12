export interface QuestionConfig {
    feedbacks: FeedbackObject[];
}

export interface FeedbackObject {
    name: string;
    feedbackMessage: string;
    id: number;
    questions: QuestionsObject[];
    answers?: AnswerObject[];
}

export interface QuestionsObject {
    id: number;
    questionText: string;
    type: string;
    dependitem: string;
    dependvalue: string;
    choices: string;
}

export interface AnswerObject {
    item: number;
    completed: string;
    courseID: string;
    value: string;
}
