import React from 'react';
import {
  Box,
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';

const faqData = [
  {
    question: "What are the key elements of a strong CV?",
    answer: [
      "A clear and professional summary",
      "Relevant work experience with measurable achievements",
      "Education and certifications",
      "Skills section highlighting both technical and soft skills",
      "Professional achievements and awards",
      "Clean formatting and consistent styling"
    ],
    tip: "Keep your CV concise (1-2 pages) and tailor it to each job application."
  },
  {
    question: "How should I format my CV for maximum impact?",
    answer: [
      "Clear section headings",
      "Bullet points for easy reading",
      "Reverse chronological order for experience",
      "Professional fonts (Arial, Calibri, or Times New Roman)",
      "Adequate white space",
      "Consistent margins and alignment"
    ],
    tip: "Avoid fancy graphics unless applying for creative positions."
  },
  {
    question: "What skills should I highlight in my CV?",
    answer: [
      "Technical skills relevant to the job",
      "Industry-specific software and tools",
      "Soft skills like communication and leadership",
      "Language proficiencies",
      "Project management abilities",
      "Problem-solving capabilities"
    ],
    tip: "Always prioritize skills mentioned in the job description."
  },
  {
    question: "How can I make my CV stand out to recruiters?",
    answer: [
      "Include quantifiable achievements",
      "Use action verbs to describe responsibilities",
      "Customize it for each job application",
      "Highlight unique experiences or skills",
      "Include relevant certifications or training",
      "Add a professional summary that tells your story"
    ],
    tip: "Focus on achievements rather than just listing responsibilities."
  },
  {
    question: "What are common CV mistakes to avoid?",
    answer: [
      "Spelling and grammatical errors",
      "Including irrelevant information",
      "Using unprofessional email addresses",
      "Exaggerating or lying about experience",
      "Using clichés and buzzwords",
      "Including personal information like age or marital status",
      "Using inconsistent formatting"
    ],
    tip: "Have someone else review your CV before submitting it."
  },
  {
    question: "How should I prepare for a job interview?",
    answer: [
      "Research the company thoroughly",
      "Review the job description",
      "Prepare answers to common questions",
      "Practice your responses",
      "Prepare questions to ask the interviewer",
      "Plan your interview outfit",
      "Arrive early and bring extra copies of your CV"
    ],
    tip: "Prepare specific examples from your experience to support your answers."
  },
  {
    question: "What are effective job search strategies?",
    answer: [
      "Use multiple job search platforms",
      "Network both online and offline",
      "Follow up on applications",
      "Set up job alerts",
      "Attend industry events",
      "Reach out to recruiters",
      "Maintain an active LinkedIn profile",
      "Join professional groups"
    ],
    tip: "Build and maintain your professional network even when not actively job searching."
  },
  {
    question: "How can I improve my online presence for job hunting?",
    answer: [
      "Create a professional LinkedIn profile",
      "Build a personal website or portfolio",
      "Maintain professional social media accounts",
      "Participate in industry discussions",
      "Share relevant content",
      "Connect with industry professionals",
      "Keep your online information consistent"
    ],
    tip: "Regularly update your online profiles to reflect your current skills and experience."
  },
  {
    question: "What should I include in my cover letter?",
    answer: [
      "A strong opening paragraph",
      "Why you're interested in the company",
      "How your skills match the job requirements",
      "Specific examples of your achievements",
      "Why you're the best candidate",
      "A call to action",
      "Professional closing"
    ],
    tip: "Keep your cover letter concise and tailored to each position."
  },
  {
    question: "How can I negotiate salary effectively?",
    answer: [
      "Research market rates",
      "Know your worth",
      "Wait for the right moment",
      "Be prepared with specific numbers",
      "Consider the entire compensation package",
      "Be professional and confident",
      "Have a clear bottom line",
      "Be ready to walk away if necessary"
    ],
    tip: "Focus on your value to the company rather than your personal needs."
  }
];

function FAQ() {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <HelpOutlineIcon sx={{ fontSize: 40, color: '#0a66c2', mr: 2 }} />
          <Typography variant="h4" component="h1" sx={{ color: '#0a66c2', fontWeight: 600 }}>
            CV & Job Search FAQ
          </Typography>
        </Box>
        
        <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
          Find answers to common questions about creating an effective CV and conducting a successful job search.
        </Typography>

        {faqData.map((faq, index) => (
          <Accordion 
            key={index} 
            sx={{ 
              mb: 2,
              '&:before': {
                display: 'none',
              },
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
              borderRadius: '8px !important',
              overflow: 'hidden',
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                backgroundColor: '#f5f5f5',
                '&:hover': {
                  backgroundColor: '#e0e0e0',
                },
                '& .MuiAccordionSummary-content': {
                  margin: '12px 0',
                },
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 500, color: '#0a66c2' }}>
                {faq.question}
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 3 }}>
              <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                {faq.answer.map((item, itemIndex) => (
                  <ListItem key={itemIndex} sx={{ py: 1 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <CheckCircleOutlineIcon sx={{ color: '#0a66c2' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary={item}
                      primaryTypographyProps={{
                        variant: 'body1',
                        color: 'text.primary',
                      }}
                    />
                  </ListItem>
                ))}
              </List>
              {faq.tip && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mt: 2 }}>
                    <TipsAndUpdatesIcon sx={{ color: '#2e7d32', mr: 1, mt: 0.5 }} />
                    <Typography variant="body2" sx={{ color: '#2e7d32', fontStyle: 'italic' }}>
                      {faq.tip}
                    </Typography>
                  </Box>
                </>
              )}
            </AccordionDetails>
          </Accordion>
        ))}
      </Paper>
    </Container>
  );
}

export default FAQ; 