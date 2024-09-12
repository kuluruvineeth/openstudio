export const survey = {
  questions: [
    {
      type: "multiple_choice",
      question: "Which features are you most interested in?",
      choices: [
        "AI Automation",
        "AI Categorization",
        "Comment Analytics",
        "Authors Management",
        "Creative Space (Future Feature)",
        "Video Generation (Future Feature)",
      ],
    },
    {
      type: "single_choice",
      question: "Which role best describes you?",
      choices: [
        "Full Time Youtuber",
        "Founder",
        "Entrepreneur",
        "Software Engineer",
        "Student",
        "Other",
      ],
    },
    {
      type: "single_choice",
      question: "What is the size of your company?",
      choices: [
        "Only me",
        "2-10 people",
        "11-100 people",
        "101-1000 people",
        "1000+ people",
      ],
    },
    {
      type: "single_choice",
      question: "How did you hear about Open Studio?",
      choices: ["Search", "Friend", "Twitter", "YouTube", "Instagram", "Other"],
    },
    {
      type: "open",
      question:
        "Last question! What feature would you love to see next from Open Studio?",
    },
  ],
};
