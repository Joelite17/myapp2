// src/data/questions.js
const questions = {
  "1": {
    "QUESTION": "The National Programme on Immunization Child Health Card contains the following:",
    "OPTION": {
      "A": "Developmental milestone versus age in months plot/chart",
      "B": "Child's immunization and vitamin A supplement record",
      "C": "Space for mother's tetanus toxoid immunization record",
      "D": "All of the above",
      "E": "None of the above"
    },
    "TRUE": ["A", "B", "C", "D"],
    "FALSE": ["E"],
    "EXPLANATION": "The NPI Child Health Card includes immunization records, maternal tetanus information, and developmental milestones."
  },
  "2": {
    "QUESTION": "The importance of 'Standing Order' in Primary Health Care System includes:",
    "OPTION": {
      "A": "Systematic approach to history taking and examination",
      "B": "Source of cost effective alternatives to procedures",
      "C": "Information for common illness",
      "D": "Ensures quality and legal backing",
      "E": "Framework for monitoring & evaluation of Medical Officer's activities"
    },
    "TRUE": ["A", "B", "C", "D"],
    "FALSE": ["E"],
    "EXPLANATION": "Standing Orders standardize care, provide information, and ensure quality/legal backing; monitoring medical officers' activities is separate."
  },
  "3": {
    "QUESTION": "Primary Health Care:",
    "OPTION": {
      "A": "Is an applied Specialty in Community Medicine",
      "B": "Requires the same perspective for different problems, based on similar conceptual theoretical models",
      "C": "Is the first-contact care, differentiated by age, gender and disease",
      "D": "Is essentially for people in the rural communities who do not have access to second facilities in the cities",
      "E": "Is particularly more important for those that cannot afford bills for secondary care"
    },
    "TRUE": ["B", "E"],
    "FALSE": ["A", "C", "D"],
    "EXPLANATION": "PHC uses consistent approaches for different health problems and is crucial for financially disadvantaged populations; it is not limited to rural areas or a specialty."
  }
};

export default questions;
