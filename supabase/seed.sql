-- ===========================================
-- EAwiz Platform Seed Data
-- ===========================================

-- ===========================================
-- PROMPT CATEGORIES
-- ===========================================
INSERT INTO prompt_categories (name, slug, description, display_order) VALUES
('Career', 'career', 'Prompts for career development and professional growth', 1),
('Event Planning', 'event-planning', 'Prompts for planning and coordinating events', 2),
('Travel', 'travel', 'Prompts for travel arrangements and itineraries', 3),
('Expenses', 'expenses', 'Prompts for expense tracking and reporting', 4),
('Data Visualization', 'data-visualization', 'Prompts for creating charts and visualizing data', 5),
('Meeting Prep', 'meeting-prep', 'Prompts for preparing executive meetings', 6),
('Presentations', 'presentations', 'Prompts for creating and improving presentations', 7),
('Reports', 'reports', 'Prompts for generating and formatting reports', 8),
('Professional Development', 'professional-development', 'Prompts for learning and skill building', 9),
('Correspondence', 'correspondence', 'Prompts for drafting professional communications', 10),
('Budgets', 'budgets', 'Prompts for budget planning and tracking', 11),
('Team Building', 'team-building', 'Prompts for team activities and engagement', 12),
('Personal Assistants', 'personal-assistants', 'Prompts for personal executive support tasks', 13),
('Remote Work', 'remote-work', 'Prompts for managing remote work scenarios', 14),
('Templates', 'templates', 'Prompts for creating reusable templates', 15),
('Automation', 'automation', 'Prompts for automating repetitive tasks', 16),
('Email', 'email', 'Prompts for email management and drafting', 17),
('Marketing', 'marketing', 'Prompts for marketing and promotional content', 18),
('Content Creation', 'content-creation', 'Prompts for creating various content types', 19);

-- ===========================================
-- PROMPTS - CAREER (20 prompts)
-- ===========================================
INSERT INTO prompts (category_id, title, description, prompt_text, use_cases) VALUES
((SELECT id FROM prompt_categories WHERE slug = 'career'),
'Executive Assistant Resume Builder',
'Create a compelling EA resume highlighting strategic impact',
'Help me create a professional resume for an Executive Assistant position. I have [X] years of experience supporting [level of executives]. My key achievements include [list 3-5 achievements]. Please format this as a modern, ATS-friendly resume that emphasizes strategic partnership, proactive problem-solving, and measurable impact. Include sections for: Professional Summary, Core Competencies, Professional Experience, and Education.',
'Job applications, career transitions, resume updates'),

((SELECT id FROM prompt_categories WHERE slug = 'career'),
'Performance Review Self-Assessment',
'Draft a comprehensive self-assessment for annual reviews',
'Help me write a self-assessment for my annual performance review as an Executive Assistant. This year I accomplished: [list key achievements]. I supported initiatives including: [list initiatives]. Areas where I exceeded expectations: [list areas]. I want to highlight my value as a strategic partner while remaining professional and quantifiable where possible.',
'Annual reviews, mid-year check-ins, performance documentation'),

((SELECT id FROM prompt_categories WHERE slug = 'career'),
'Salary Negotiation Preparation',
'Prepare talking points for compensation discussions',
'I''m preparing for a salary negotiation as an Executive Assistant. My current salary is [amount] and I''m seeking [target]. I''ve been in this role for [duration]. Key accomplishments that justify an increase include: [list]. Research shows market rate is [range]. Help me prepare: 1) Opening statement 2) Key talking points 3) Responses to common objections 4) How to discuss my unique value',
'Salary negotiations, promotion discussions, compensation reviews'),

((SELECT id FROM prompt_categories WHERE slug = 'career'),
'LinkedIn Profile Optimization',
'Optimize your LinkedIn profile for EA opportunities',
'Help me optimize my LinkedIn profile as an Executive Assistant. I want to attract recruiters and demonstrate my strategic value. Current headline: [headline]. About section: [current about]. Key skills: [list skills]. Please rewrite my headline, about section, and suggest 10 skills to highlight. Make it keyword-rich while maintaining authenticity and professionalism.',
'LinkedIn updates, networking, personal branding'),

((SELECT id FROM prompt_categories WHERE slug = 'career'),
'Interview Question Preparation',
'Prepare STAR-format answers for common EA interview questions',
'I have an interview for an Executive Assistant position supporting a [C-suite role] at [company type]. Help me prepare STAR-format answers for these common questions: 1) Tell me about a time you handled a difficult scheduling conflict 2) Describe managing confidential information 3) How do you prioritize competing demands? Include specific examples relevant to executive support.',
'Job interviews, interview preparation, practice sessions'),

((SELECT id FROM prompt_categories WHERE slug = 'career'),
'Professional Development Plan',
'Create a 12-month development plan for career growth',
'Create a professional development plan for an Executive Assistant looking to advance to [target role/level]. Current strengths: [list]. Areas for growth: [list]. Available budget: [amount]. Include: quarterly goals, recommended certifications/courses, skills to develop, networking activities, and metrics to track progress.',
'Career planning, skill development, goal setting'),

((SELECT id FROM prompt_categories WHERE slug = 'career'),
'Thank You Note After Interview',
'Draft a memorable post-interview thank you note',
'Write a professional thank you email after my interview for an Executive Assistant position at [company]. I interviewed with [name/title]. Key discussion points included: [list 2-3 topics]. I want to reiterate my interest and address [specific point from interview]. Keep it concise but memorable.',
'Post-interview follow-up, professional etiquette'),

((SELECT id FROM prompt_categories WHERE slug = 'career'),
'Mentor Outreach Message',
'Craft a message to request mentorship from an experienced EA',
'Help me write a LinkedIn message to [name], a senior Executive Assistant I admire. I want to ask if they''d be open to a brief mentorship conversation. My background: [brief description]. What I hope to learn: [specific topics]. Keep it respectful of their time and professional.',
'Networking, mentorship requests, professional relationships'),

((SELECT id FROM prompt_categories WHERE slug = 'career'),
'Skills Gap Analysis',
'Identify and plan to address career skill gaps',
'Analyze the skill gaps between my current abilities and requirements for [target role]. My current skills: [list]. Target role requirements: [list or job description]. Provide: 1) Priority skills to develop 2) Resources for each skill 3) Timeline recommendations 4) How to gain experience in each area.',
'Career planning, skill development, job targeting'),

((SELECT id FROM prompt_categories WHERE slug = 'career'),
'Resignation Letter Draft',
'Write a professional resignation letter maintaining relationships',
'Help me draft a professional resignation letter. Current role: Executive Assistant to [title]. Tenure: [duration]. Reason for leaving: [brief reason - optional]. Last day: [date]. I want to maintain a positive relationship and offer to help with transition. Keep it brief, professional, and gracious.',
'Job transitions, resignations, career moves'),

((SELECT id FROM prompt_categories WHERE slug = 'career'),
'Networking Event Elevator Pitch',
'Create a compelling 30-second introduction for networking',
'Create a 30-second elevator pitch for networking events. I''m an Executive Assistant with [X] years experience supporting [level executives] in [industry]. My specialty is [unique value]. I''m currently interested in [goal/opportunity]. Make it engaging and memorable without being salesy.',
'Networking events, conferences, professional introductions'),

((SELECT id FROM prompt_categories WHERE slug = 'career'),
'Promotion Request Proposal',
'Build a business case for your promotion',
'Help me create a promotion proposal from [current title] to [target title]. My achievements this year: [list with metrics]. Additional responsibilities I''ve taken on: [list]. My vision for the expanded role: [description]. Market data supporting the promotion: [if available]. Format as a professional one-page proposal.',
'Promotions, career advancement, compensation discussions'),

((SELECT id FROM prompt_categories WHERE slug = 'career'),
'Conference Attendance Justification',
'Write a compelling request to attend a professional conference',
'Write a business justification for attending [conference name] on [dates]. Cost: [amount]. Benefits include: [list 3-5 benefits]. Skills I''ll develop: [list]. How I''ll share learnings with the team: [plan]. Present this as an investment in both my development and organizational value.',
'Professional development, conference requests, training approvals'),

((SELECT id FROM prompt_categories WHERE slug = 'career'),
'Weekly Accomplishment Tracker',
'Template for documenting weekly wins and impact',
'Create a template for tracking weekly accomplishments as an Executive Assistant. Include categories for: time saved for executive, problems solved, initiatives supported, professional development, and stakeholder feedback. Make it quick to complete (5 minutes) but comprehensive enough for performance reviews.',
'Performance tracking, self-documentation, review preparation'),

((SELECT id FROM prompt_categories WHERE slug = 'career'),
'Career Transition Cover Letter',
'Write a cover letter when transitioning from another field to EA',
'Write a cover letter for transitioning into an Executive Assistant role from [previous career]. Transferable skills include: [list]. Relevant experience: [examples]. Why EA: [motivation]. Address potential concerns about the transition while highlighting unique perspective and value I bring.',
'Career transitions, cover letters, job applications'),

((SELECT id FROM prompt_categories WHERE slug = 'career'),
'Certification Value Analysis',
'Evaluate which EA certifications provide the best ROI',
'Compare EA certifications and their value for career advancement: CAP, CEAP, and other relevant credentials. For each, provide: cost, time commitment, requirements, employer recognition, and career impact. Based on my goals of [specific goals], recommend which to pursue first.',
'Professional development, certification planning, career investment'),

((SELECT id FROM prompt_categories WHERE slug = 'career'),
'90-Day New Role Plan',
'Create an onboarding plan for a new EA position',
'Create a 90-day plan for starting a new Executive Assistant position. The executive I''ll support is a [title] at [company type]. Week 1-30: Learning and relationship building. Days 31-60: Adding value and establishing systems. Days 61-90: Proactive optimization. Include specific actions, questions to ask, and milestones.',
'New job onboarding, role transitions, first impressions'),

((SELECT id FROM prompt_categories WHERE slug = 'career'),
'Work-Life Boundary Setting',
'Develop strategies for maintaining healthy boundaries',
'Help me develop a plan for setting healthy work-life boundaries as an Executive Assistant. Current challenges: [list]. Executive expectations: [describe]. Personal priorities: [list]. Provide: specific boundary-setting language, strategies for managing after-hours requests, and how to communicate boundaries professionally.',
'Work-life balance, boundary setting, burnout prevention'),

((SELECT id FROM prompt_categories WHERE slug = 'career'),
'Personal Brand Statement',
'Craft your unique EA value proposition',
'Help me develop a personal brand statement as an Executive Assistant. My unique strengths: [list]. The problems I solve: [list]. My professional values: [list]. Industries/executives I work best with: [describe]. Create a concise brand statement I can use across LinkedIn, my resume, and networking.',
'Personal branding, career positioning, professional identity'),

((SELECT id FROM prompt_categories WHERE slug = 'career'),
'Exit Interview Preparation',
'Prepare thoughtful, professional exit interview responses',
'Help me prepare for an exit interview as a departing Executive Assistant. Tenure: [duration]. Reason for leaving: [general reason]. Things I appreciated: [list]. Constructive feedback I could share: [list]. Help me frame responses that are honest but professional and maintain relationships.',
'Exit interviews, job transitions, professional departure');

-- ===========================================
-- PROMPTS - EVENT PLANNING (20 prompts)
-- ===========================================
INSERT INTO prompts (category_id, title, description, prompt_text, use_cases) VALUES
((SELECT id FROM prompt_categories WHERE slug = 'event-planning'),
'Executive Offsite Planning Checklist',
'Complete checklist for planning leadership team offsites',
'Create a comprehensive planning checklist for a [duration] executive offsite for [number] attendees. Location: [venue type]. Purpose: [strategic planning/team building/etc.]. Include: venue requirements, catering, AV needs, materials, transportation, accommodation, agenda framework, follow-up items, and timeline working backward from event date.',
'Executive offsites, leadership retreats, strategic planning sessions'),

((SELECT id FROM prompt_categories WHERE slug = 'event-planning'),
'Board Meeting Preparation Guide',
'Step-by-step board meeting preparation checklist',
'Create a board meeting preparation checklist for [company type]. Meeting date: [date]. Attendees: [number of board members]. Include: pre-meeting materials timeline, room setup, technology checks, catering, materials preparation, attendee confirmations, day-of logistics, and post-meeting follow-up tasks.',
'Board meetings, investor meetings, governance events'),

((SELECT id FROM prompt_categories WHERE slug = 'event-planning'),
'Virtual Event Platform Comparison',
'Compare virtual event platforms for executive needs',
'Compare virtual event platforms for hosting a [type of event] with [number] attendees. Key requirements: [list features needed]. Budget: [range]. Compare: Zoom, Teams, Webex, Hopin, and any others relevant. Include pricing, features, ease of use, recording capabilities, and breakout room options.',
'Virtual events, platform selection, technology planning'),

((SELECT id FROM prompt_categories WHERE slug = 'event-planning'),
'Client Dinner Planning',
'Plan an impressive client appreciation dinner',
'Plan a client dinner for [number] guests. Purpose: [relationship building/deal celebration/etc.]. Budget: [amount]. Dietary restrictions to consider: [list any known]. City: [location]. Provide: 3 restaurant recommendations with rationale, seating arrangement suggestions, conversation topics to prepare, and follow-up gift ideas.',
'Client entertainment, relationship building, executive dinners'),

((SELECT id FROM prompt_categories WHERE slug = 'event-planning'),
'Annual Company Event Timeline',
'Create a year-long event planning calendar',
'Create an annual event planning calendar for a [company size] company. Include: holiday parties, team building events, all-hands meetings, board meetings, client events, and industry conferences. For each, provide: planning lead time needed, typical budget range, and key considerations.',
'Annual planning, event calendar, resource allocation'),

((SELECT id FROM prompt_categories WHERE slug = 'event-planning'),
'Conference Speaking Submission',
'Draft a conference speaking proposal for your executive',
'Write a conference speaking proposal for [executive name], [title] at [company]. Conference: [name]. Topic area: [subject]. Their expertise includes: [background]. The proposal should include: session title, abstract (150 words), learning objectives, and speaker bio. Make it compelling and relevant to the audience.',
'Conference submissions, thought leadership, speaker proposals'),

((SELECT id FROM prompt_categories WHERE slug = 'event-planning'),
'Event Budget Template',
'Create a detailed event budget tracker',
'Create a detailed event budget template for a [type of event] with [number] attendees. Categories to include: venue, catering, AV/technology, materials/printing, transportation, accommodation, entertainment, contingency. Include formulas for tracking actual vs. budgeted and variance percentages.',
'Budget planning, expense tracking, financial management'),

((SELECT id FROM prompt_categories WHERE slug = 'event-planning'),
'Vendor Comparison Matrix',
'Compare event vendors systematically',
'Create a vendor comparison matrix for [service type: catering/AV/venue/etc.]. I''m evaluating: [vendor names]. Comparison criteria should include: pricing, quality, reliability, flexibility, reviews/references, and specific requirements: [list any]. Format as a decision matrix with scoring.',
'Vendor selection, procurement, decision-making'),

((SELECT id FROM prompt_categories WHERE slug = 'event-planning'),
'Event Risk Assessment',
'Identify and mitigate event risks',
'Create a risk assessment for [type of event] on [date]. Location: [venue]. Expected attendees: [number]. Identify potential risks related to: weather, technology failures, vendor issues, health/safety, travel disruptions, and no-shows. For each risk, provide: likelihood, impact, and mitigation strategies.',
'Risk management, contingency planning, event preparation'),

((SELECT id FROM prompt_categories WHERE slug = 'event-planning'),
'Post-Event Survey Questions',
'Design effective event feedback surveys',
'Create a post-event survey for [type of event]. Goals: measure satisfaction, gather feedback for improvement, and identify future topics of interest. Include 10-12 questions mixing rating scales, multiple choice, and open-ended. Keep it under 5 minutes to complete. Include questions about: content, logistics, networking, and overall experience.',
'Feedback collection, event improvement, attendee insights'),

((SELECT id FROM prompt_categories WHERE slug = 'event-planning'),
'Event Communication Timeline',
'Plan all event-related communications',
'Create a communication timeline for [event name] on [date]. Include: save the date, formal invitation, reminder emails, pre-event information, day-of communications, and post-event follow-up. For each, provide: timing, channel (email/calendar/etc.), key messages, and audience.',
'Event communications, attendee engagement, marketing'),

((SELECT id FROM prompt_categories WHERE slug = 'event-planning'),
'Hybrid Event Best Practices',
'Guidelines for successful hybrid events',
'Create a best practices guide for a hybrid [type of event] with [in-person number] in-person and [virtual number] virtual attendees. Address: technology setup, engagement strategies for both audiences, facilitator tips, timing considerations, and common pitfalls to avoid.',
'Hybrid events, virtual + in-person, technology integration'),

((SELECT id FROM prompt_categories WHERE slug = 'event-planning'),
'VIP Guest Management Protocol',
'Protocol for managing high-profile attendees',
'Create a VIP guest management protocol for [event type]. VIPs include: [describe attendee types]. Include: advance coordination, arrival procedures, assigned point of contact, special accommodations, security considerations, and departure arrangements. Also include escalation procedures for issues.',
'VIP management, executive events, high-profile guests'),

((SELECT id FROM prompt_categories WHERE slug = 'event-planning'),
'Team Building Activity Ideas',
'Curate team building activities for different group sizes',
'Suggest 10 team building activities for a [team size] team. Context: [in-person/virtual/hybrid]. Duration available: [time]. Budget per person: [amount]. Team characteristics: [describe]. For each activity, provide: description, time needed, materials, pros/cons, and which team dynamics it addresses.',
'Team building, employee engagement, group activities'),

((SELECT id FROM prompt_categories WHERE slug = 'event-planning'),
'Event Run of Show Document',
'Create a detailed event timeline for day-of execution',
'Create a run of show document for [event name] on [date]. Event duration: [time range]. Include: detailed timeline with specific times, responsible person for each item, room/location, technical requirements, and transition notes. Add buffer time for realistic execution.',
'Day-of logistics, event execution, team coordination'),

((SELECT id FROM prompt_categories WHERE slug = 'event-planning'),
'Venue Site Visit Checklist',
'Questions and checks for venue site visits',
'Create a site visit checklist for evaluating [venue name/type] for [type of event]. Include: room dimensions and capacity, AV capabilities, catering facilities, parking/accessibility, backup spaces, wifi strength, lighting control, acoustics, and vendor restrictions. Add questions to ask the venue coordinator.',
'Venue selection, site evaluation, logistics planning'),

((SELECT id FROM prompt_categories WHERE slug = 'event-planning'),
'Emergency Response Plan',
'Event emergency and crisis response procedures',
'Create an emergency response plan for [type of event] at [venue type]. Number of attendees: [number]. Cover: medical emergencies, fire/evacuation, severe weather, security incidents, and technology failures. Include: emergency contacts, nearest hospital, designated assembly points, and communication protocols.',
'Emergency planning, safety protocols, crisis management'),

((SELECT id FROM prompt_categories WHERE slug = 'event-planning'),
'Award Ceremony Script',
'Write a script for a company awards ceremony',
'Write a script for a [duration] awards ceremony at [company]. Awards being presented: [list categories]. Include: opening remarks, transitions between awards, winner announcement format, and closing. Tone should be [formal/celebratory/casual]. Include placeholders for winner names and accomplishments.',
'Awards ceremonies, recognition events, company celebrations'),

((SELECT id FROM prompt_categories WHERE slug = 'event-planning'),
'Networking Event Format',
'Design an effective networking event structure',
'Design a networking event format for [number] attendees. Duration: [time]. Goals: [relationship building/business development/etc.]. Include: icebreaker activities, structured networking rotations, conversation starter prompts, and wind-down period. Balance structured and unstructured time.',
'Networking events, professional gatherings, relationship building'),

((SELECT id FROM prompt_categories WHERE slug = 'event-planning'),
'Event Cancellation Communication',
'Handle event cancellation professionally',
'Draft communications for canceling [event name] originally scheduled for [date]. Reason: [general reason]. Include: initial announcement, FAQ anticipation, refund/rescheduling information, and alternative offerings. Tone should be apologetic but professional, maintaining relationships.',
'Crisis communication, event cancellation, stakeholder management');

-- ===========================================
-- PROMPTS - TRAVEL (20 prompts)
-- ===========================================
INSERT INTO prompts (category_id, title, description, prompt_text, use_cases) VALUES
((SELECT id FROM prompt_categories WHERE slug = 'travel'),
'Executive Travel Itinerary Template',
'Create a comprehensive executive travel itinerary',
'Create a detailed travel itinerary for [executive name] traveling to [destination] from [date] to [date]. Trip purpose: [meeting/conference/etc.]. Include: flight details with confirmation numbers, ground transportation, hotel information, meeting schedule with addresses, restaurant reservations, time zone considerations, and emergency contacts. Format for easy mobile viewing.',
'Business travel, executive trips, itinerary planning'),

((SELECT id FROM prompt_categories WHERE slug = 'travel'),
'Travel Booking Comparison',
'Compare travel options for best value',
'Compare travel options for a trip from [origin] to [destination] on [dates]. Traveler preferences: [aisle/window, airline status, etc.]. Budget: [range]. Compare: direct vs. connecting flights, airlines, fare classes, and hotel options near [meeting location]. Recommend the best value option considering time, cost, and comfort.',
'Travel booking, cost comparison, trip optimization'),

((SELECT id FROM prompt_categories WHERE slug = 'travel'),
'International Travel Checklist',
'Pre-departure checklist for international business travel',
'Create a pre-departure checklist for international travel to [country]. Trip dates: [range]. Include: passport/visa requirements, vaccination recommendations, currency exchange, phone/data plan, power adapters, cultural considerations, business card protocol, and gift-giving customs. Also include emergency embassy contact.',
'International travel, trip preparation, cultural awareness'),

((SELECT id FROM prompt_categories WHERE slug = 'travel'),
'Flight Delay Action Plan',
'Protocol for handling travel disruptions',
'Create an action plan for handling flight delays/cancellations for executive travel. Include: immediate steps to take, alternative routing options to research, hotel and ground transportation rebooking, meeting rescheduling communication templates, expense documentation, and escalation to airline status lines.',
'Travel disruptions, crisis management, contingency planning'),

((SELECT id FROM prompt_categories WHERE slug = 'travel'),
'Corporate Travel Policy Summary',
'Create an easy-reference travel policy guide',
'Summarize our corporate travel policy into a quick-reference guide. Policy includes: [paste or describe key policies]. Create a one-page summary covering: booking procedures, expense limits by category, approval requirements, preferred vendors, and reimbursement process. Make it scannable.',
'Policy compliance, travel guidelines, reference documents'),

((SELECT id FROM prompt_categories WHERE slug = 'travel'),
'Multi-City Trip Optimizer',
'Optimize routing for complex multi-city trips',
'Optimize a multi-city business trip visiting: [list cities] between [start date] and [end date]. Meetings required: [list with any time constraints]. Consider: logical routing, time zone recovery, flight availability, and cost. Provide recommended routing with rationale and alternative options.',
'Multi-city travel, trip optimization, routing decisions'),

((SELECT id FROM prompt_categories WHERE slug = 'travel'),
'Hotel Selection Criteria',
'Evaluate hotels for executive stays',
'Evaluate hotels in [city] for an executive stay on [dates]. Requirements: [list requirements like proximity to meetings, gym, late check-out, etc.]. Budget: [range]. Compare 3-4 options including: location, amenities, reviews, loyalty program benefits, and cancellation policies. Recommend top choice with reasoning.',
'Hotel selection, accommodation planning, vendor evaluation'),

((SELECT id FROM prompt_categories WHERE slug = 'travel'),
'Ground Transportation Brief',
'Research ground transportation options for a destination',
'Research ground transportation options in [city] for [dates]. Needs: airport transfers, daily transportation to/from [meeting locations], and potential evening events. Compare: rental car, car service, rideshare, and public transit. Consider: cost, reliability, convenience, and safety. Provide recommendations.',
'Ground transportation, logistics, destination research'),

((SELECT id FROM prompt_categories WHERE slug = 'travel'),
'Business Dinner Recommendations',
'Research restaurant options for business entertaining',
'Recommend 5 restaurants in [city] suitable for a business dinner with [number] guests. Occasion: [client dinner/team dinner/celebration]. Dietary requirements: [list any]. Preferences: [cuisine type, ambiance]. For each, provide: cuisine, price range, ambiance, signature dishes, and reservation notes.',
'Dining recommendations, client entertainment, destination knowledge'),

((SELECT id FROM prompt_categories WHERE slug = 'travel'),
'Packing List Generator',
'Create a customized packing list for business trips',
'Create a packing list for a [duration] business trip to [destination]. Weather expected: [conditions]. Events include: [list meeting types, dinners, etc.]. Include: clothing by day/event, toiletries, electronics, documents, and carry-on vs. checked recommendations. Account for any dress code requirements.',
'Packing, trip preparation, traveler support'),

((SELECT id FROM prompt_categories WHERE slug = 'travel'),
'Loyalty Program Optimization',
'Maximize travel loyalty program benefits',
'Analyze loyalty program strategy for an executive who travels [frequency] annually. Current status: [airline/hotel statuses]. Primary destinations: [list]. Provide recommendations for: which programs to prioritize, status match opportunities, optimal credit card strategy, and point redemption priorities.',
'Loyalty programs, travel rewards, cost savings'),

((SELECT id FROM prompt_categories WHERE slug = 'travel'),
'Visa Application Guide',
'Step-by-step visa application assistance',
'Create a visa application guide for [country] for a [nationality] passport holder. Travel dates: [range]. Purpose: [business/conference/etc.]. Include: visa type needed, required documents, processing time, application steps, expedite options, and common mistakes to avoid. Note any interview requirements.',
'Visa applications, international travel, documentation'),

((SELECT id FROM prompt_categories WHERE slug = 'travel'),
'Travel Expense Pre-Authorization',
'Draft travel expense pre-authorization requests',
'Draft a travel expense pre-authorization request for [trip purpose] to [destination] on [dates]. Estimated costs: flights [amount], hotel [amount/night for X nights], ground [amount], meals [daily estimate], other [specify]. Justify business purpose and any expenses above policy limits.',
'Expense approval, pre-authorization, budget compliance'),

((SELECT id FROM prompt_categories WHERE slug = 'travel'),
'Meeting Location Research',
'Research meeting and venue options in an unfamiliar city',
'Research meeting location options in [city] for a [type of meeting] with [number] attendees on [date]. Requirements: [list needs like AV, catering, etc.]. Duration: [time]. Budget: [range]. Provide 3 options: hotel meeting room, coworking space, and restaurant private room. Include pricing and booking info.',
'Meeting venues, destination research, venue sourcing'),

((SELECT id FROM prompt_categories WHERE slug = 'travel'),
'Executive Travel Preferences Profile',
'Document and maintain travel preferences',
'Create a travel preferences profile template for executives. Include: airline preferences (seat, meal, alliance), hotel preferences (room type, floor, amenities), dietary restrictions, ground transportation preferences, communication preferences during travel, emergency contact priorities, and any health considerations.',
'Preference management, personalization, executive support'),

((SELECT id FROM prompt_categories WHERE slug = 'travel'),
'Trip Briefing Document',
'Prepare a pre-trip briefing for executives',
'Create a trip briefing document for [executive name] traveling to [destination]. Include: trip objectives, key contacts with photos and bios, meeting agendas, background on companies/people, local customs/tips, weather forecast, and key phrases in local language if applicable. Format as a scannable one-pager with links to details.',
'Trip preparation, executive briefing, meeting support'),

((SELECT id FROM prompt_categories WHERE slug = 'travel'),
'Travel Cancellation Process',
'Handle trip cancellation and refunds efficiently',
'Create a checklist for canceling a business trip to [destination] originally on [dates]. Bookings include: [list flight, hotel, car, restaurants, etc.]. For each, identify: cancellation policy, deadline, expected refund/credit, and action required. Also draft communication to any external parties affected.',
'Trip cancellation, refund processing, booking management'),

((SELECT id FROM prompt_categories WHERE slug = 'travel'),
'Conference Attendance Planning',
'Plan comprehensive conference attendance',
'Plan attendance at [conference name] in [city] on [dates]. Registration: [status]. Create: travel arrangements checklist, sessions to attend (if agenda available), networking targets, booth visits, evening events, and follow-up action plan. Include pre-conference preparation tasks.',
'Conference planning, event attendance, professional development'),

((SELECT id FROM prompt_categories WHERE slug = 'travel'),
'Same-Day Travel Troubleshooting',
'Rapid response for travel day issues',
'Provide rapid troubleshooting steps for: [scenario - e.g., "executive missed connection in Chicago, needs to reach NYC for 6pm meeting"]. Include: immediate rebooking options, alternative transportation, communication templates for the meeting, and preventive measures for future.',
'Crisis management, rapid response, problem solving'),

((SELECT id FROM prompt_categories WHERE slug = 'travel'),
'Travel Budget Forecast',
'Forecast annual travel expenses',
'Create a travel budget forecast for [executive/department] for [year]. Historical spend: [prior year amount]. Known trips: [list confirmed travel]. Assumptions for ad-hoc travel: [describe]. Break down by: air, hotel, ground, meals, and incidentals. Include variance scenarios for high/low travel.',
'Budget planning, expense forecasting, financial planning');

-- Continue with more categories...
-- ===========================================
-- PROMPTS - EXPENSES (20 prompts)
-- ===========================================
INSERT INTO prompts (category_id, title, description, prompt_text, use_cases) VALUES
((SELECT id FROM prompt_categories WHERE slug = 'expenses'),
'Expense Report Categorization',
'Properly categorize complex expenses',
'Help me categorize these expenses for my expense report: [list expenses with amounts]. Company policy categories include: Travel, Meals & Entertainment, Office Supplies, Technology, Professional Development, Client Gifts, and Miscellaneous. For each expense, provide: recommended category, any required documentation, and policy considerations.',
'Expense reports, categorization, policy compliance'),

((SELECT id FROM prompt_categories WHERE slug = 'expenses'),
'Receipt Documentation Template',
'Create thorough expense documentation',
'Create a documentation template for expense receipts that ensures compliance. Include fields for: date, vendor, amount, business purpose, attendees (for meals), project/client code, and approver. Also create a naming convention for digital receipt storage.',
'Documentation, compliance, record-keeping'),

((SELECT id FROM prompt_categories WHERE slug = 'expenses'),
'Expense Policy Exception Request',
'Draft exception requests for out-of-policy expenses',
'Draft an expense policy exception request for: [describe expense and amount]. Policy limit: [amount or rule]. Reason for exception: [business justification]. Include: clear business case, any cost savings achieved, alternatives considered, and requested approval. Keep professional and concise.',
'Policy exceptions, approvals, business justification'),

((SELECT id FROM prompt_categories WHERE slug = 'expenses'),
'Monthly Expense Analysis',
'Analyze spending patterns and trends',
'Analyze this month''s expenses: [paste or describe expenses]. Compare to budget of [amount]. Identify: spending by category, variance from budget, unusual items, and trends vs. prior months. Provide a brief executive summary with any concerns or recommendations.',
'Expense analysis, budget tracking, financial review'),

((SELECT id FROM prompt_categories WHERE slug = 'expenses'),
'Vendor Invoice Review Checklist',
'Verify vendor invoices before payment',
'Create an invoice verification checklist for vendor invoices. Include checks for: correct vendor information, PO match, pricing accuracy, quantity verification, applicable discounts, payment terms, proper coding, and required approvals. Flag common errors to watch for.',
'Invoice processing, vendor management, payment accuracy'),

((SELECT id FROM prompt_categories WHERE slug = 'expenses'),
'Expense Reimbursement Follow-up',
'Draft follow-up for delayed reimbursements',
'Draft a professional follow-up email for expense reimbursement. Report submitted: [date]. Amount: [total]. Items included: [brief description]. Status: [current status if known]. Request: timeline for processing and any additional documentation needed. Keep tone professional and patient.',
'Reimbursement, follow-up, accounts payable'),

((SELECT id FROM prompt_categories WHERE slug = 'expenses'),
'Corporate Card Reconciliation',
'Reconcile corporate credit card statements',
'Create a reconciliation process for corporate credit card statements. Monthly statement: [amount]. Include: matching receipts to charges, identifying missing documentation, flagging personal charges, coding business expenses, and documenting any discrepancies. Provide a reconciliation summary template.',
'Card reconciliation, expense management, accounting'),

((SELECT id FROM prompt_categories WHERE slug = 'expenses'),
'Per Diem Calculation',
'Calculate per diem for business travel',
'Calculate per diem allowance for travel to [destination] on [dates]. Trip type: [domestic/international]. Include: GSA rates if applicable, lodging cap, meals breakdown, incidentals, and any regional adjustments. Also note what receipts are still required vs. per diem coverage.',
'Per diem, travel policy, expense calculation'),

((SELECT id FROM prompt_categories WHERE slug = 'expenses'),
'Entertainment Expense Justification',
'Document business entertainment properly',
'Document a business entertainment expense: [type - dinner, event, etc.] on [date] with [attendees]. Amount: [cost]. Create documentation including: business purpose, relationship to company goals, list of attendees with titles/companies, and topics discussed. Ensure IRS compliance.',
'Entertainment expenses, documentation, compliance'),

((SELECT id FROM prompt_categories WHERE slug = 'expenses'),
'Quarterly Expense Summary',
'Summarize quarterly expenses for leadership review',
'Create a quarterly expense summary report for [department/executive]. Data: [provide or describe]. Include: total spend by category, comparison to budget, trend vs. prior quarters, notable items, and forecast for remaining year. Present as an executive-friendly one-pager with key insights.',
'Quarterly reporting, financial summary, executive reporting'),

((SELECT id FROM prompt_categories WHERE slug = 'expenses'),
'Expense Audit Preparation',
'Prepare for expense audit review',
'Prepare for an expense audit of [time period]. Gather: all receipts and documentation, approval chains, policy references, and any exception approvals. Create a checklist of common audit findings to review proactively: missing receipts, inadequate business purpose, policy violations, etc.',
'Audit preparation, compliance, documentation review'),

((SELECT id FROM prompt_categories WHERE slug = 'expenses'),
'Cost Center Allocation',
'Allocate shared expenses across cost centers',
'Allocate these shared expenses across cost centers: [describe expenses]. Cost centers involved: [list]. Allocation methodology: [describe or ask for recommendation]. Create an allocation table and document the rationale for future reference.',
'Cost allocation, accounting, expense distribution'),

((SELECT id FROM prompt_categories WHERE slug = 'expenses'),
'Expense System Training Guide',
'Create expense system user guide for team',
'Create a quick-start guide for [expense system name]. Include: how to submit reports, attaching receipts, selecting categories, adding business purpose, submission deadlines, approval workflow, and troubleshooting common issues. Keep it visual and scannable for new users.',
'Training, system documentation, onboarding'),

((SELECT id FROM prompt_categories WHERE slug = 'expenses'),
'Mileage Tracking Template',
'Track business mileage for reimbursement',
'Create a mileage tracking template for business driving. Include: date, starting/ending location, purpose, miles driven, and running total. Reference current IRS mileage rate ([rate] per mile). Calculate monthly totals and reimbursement amounts. Note documentation requirements.',
'Mileage tracking, reimbursement, IRS compliance'),

((SELECT id FROM prompt_categories WHERE slug = 'expenses'),
'Expense Policy Quick Reference',
'Create an at-a-glance policy summary',
'Create a quick-reference card for our expense policy. Key limits: [list known limits]. Include: meal caps, travel booking requirements, approval thresholds, receipt requirements, and prohibited expenses. Format as a one-page or card-sized reference for wallets.',
'Policy reference, compliance, employee communication'),

((SELECT id FROM prompt_categories WHERE slug = 'expenses'),
'International Expense Conversion',
'Handle foreign currency expenses',
'Process these international expenses: [list with foreign amounts and currencies]. Trip dates: [range]. Provide: converted USD amounts using exchange rates for those dates, documentation of rates used, and any currency conversion fees to account for.',
'Currency conversion, international expenses, documentation'),

((SELECT id FROM prompt_categories WHERE slug = 'expenses'),
'Expense Dispute Resolution',
'Handle disputes with vendors or card companies',
'Draft a dispute for: [describe charge - wrong amount, duplicate, unauthorized, etc.]. Card/Account: [last 4 digits]. Original amount: [amount]. Date: [transaction date]. Include: clear explanation of issue, supporting documentation available, and requested resolution.',
'Dispute resolution, card issues, vendor problems'),

((SELECT id FROM prompt_categories WHERE slug = 'expenses'),
'Gift and Hospitality Log',
'Track gifts given and received for compliance',
'Create a gift and hospitality tracking log for compliance. Include: date, giver/recipient, description, estimated value, relationship, and business purpose. Our gift policy limits: [describe limits]. Flag any items requiring disclosure or approval.',
'Gift tracking, compliance, ethics policies'),

((SELECT id FROM prompt_categories WHERE slug = 'expenses'),
'Expense Reduction Ideas',
'Identify opportunities to reduce expenses',
'Analyze these recurring expenses for reduction opportunities: [list or describe spending categories]. Identify: underutilized subscriptions, vendor consolidation opportunities, alternative providers, and policy changes that could save money without impacting productivity.',
'Cost reduction, expense optimization, budget management'),

((SELECT id FROM prompt_categories WHERE slug = 'expenses'),
'Year-End Expense Cleanup',
'Process year-end expense items properly',
'Create a year-end expense checklist. Include: submitting outstanding reports before deadline, accruing unpaid expenses, prepaid expense treatment, verification of vendor 1099 information, and documentation archiving. Deadline: [date]. Highlight accounting treatment considerations.',
'Year-end close, accounting, compliance');

-- ===========================================
-- PROMPTS - MEETING PREP (20 prompts)
-- ===========================================
INSERT INTO prompts (category_id, title, description, prompt_text, use_cases) VALUES
((SELECT id FROM prompt_categories WHERE slug = 'meeting-prep'),
'Executive Briefing Document',
'Create a pre-meeting briefing for your executive',
'Create a briefing document for [executive name]''s meeting with [attendee names and companies] on [date]. Meeting purpose: [topic]. Include: attendee bios with photos and recent news, company background, relationship history, discussion points to prepare, potential questions to anticipate, and desired outcomes.',
'Executive briefings, meeting preparation, stakeholder research'),

((SELECT id FROM prompt_categories WHERE slug = 'meeting-prep'),
'Board Meeting Prep Package',
'Assemble comprehensive board meeting materials',
'Create a board meeting preparation checklist for [date]. Include: materials to prepare (financials, presentations, reports), pre-read distribution timeline, logistics confirmation, technology testing, attendee dietary needs, and day-of run sheet. Also draft the pre-meeting reminder email to board members.',
'Board meetings, governance, executive support'),

((SELECT id FROM prompt_categories WHERE slug = 'meeting-prep'),
'One-on-One Meeting Agenda',
'Structure productive one-on-one meetings',
'Create an agenda template for [executive name]''s one-on-one meetings with [direct report/peer]. Frequency: [weekly/biweekly/monthly]. Include: standing agenda items, time allocations, space for current topics, action item review, and forward-looking discussion. Keep it focused on [relationship type] priorities.',
'One-on-ones, manager meetings, recurring meetings'),

((SELECT id FROM prompt_categories WHERE slug = 'meeting-prep'),
'Client Meeting Research',
'Research clients before important meetings',
'Research [company name] before our meeting on [date]. Provide: company overview, recent news (last 90 days), financial highlights if public, key executives attending and their backgrounds, our relationship history, and potential pain points or opportunities. Cite sources.',
'Client research, meeting preparation, relationship management'),

((SELECT id FROM prompt_categories WHERE slug = 'meeting-prep'),
'Meeting Attendee Management',
'Manage meeting invitations and responses',
'Help me manage attendees for [meeting name] on [date]. Invited: [list]. Confirmed: [list]. Pending: [list]. Declined: [list]. Draft: follow-up for non-responders, notification of key declines to meeting owner, and update to meeting materials if needed based on changes.',
'Attendee management, meeting logistics, communication'),

((SELECT id FROM prompt_categories WHERE slug = 'meeting-prep'),
'Technical Demo Preparation',
'Prepare for product or technical demonstrations',
'Prepare a checklist for a technical demo of [product/system] to [audience] on [date]. Include: technology requirements, backup plans, demo script/flow, key features to highlight, anticipated questions, and dry-run schedule. Note any customization needed for this audience.',
'Technical demos, presentations, product showcases'),

((SELECT id FROM prompt_categories WHERE slug = 'meeting-prep'),
'Interview Panel Coordination',
'Coordinate multi-person interview panels',
'Coordinate an interview panel for [candidate name] for [position] on [date]. Interviewers: [list with roles]. Create: schedule with time blocks, question assignments by interviewer, evaluation criteria, logistics (room/video link), and debrief meeting invite. Draft candidate confirmation email.',
'Interview coordination, hiring, recruitment support'),

((SELECT id FROM prompt_categories WHERE slug = 'meeting-prep'),
'Meeting Materials Checklist',
'Ensure all meeting materials are prepared',
'Create a meeting materials checklist for [meeting type]. Include: presentation decks, handouts, name tents, agendas, note-taking templates, pens/notepads, and any technical equipment. Add timeline for when each should be ready and who is responsible.',
'Meeting preparation, logistics, checklist management'),

((SELECT id FROM prompt_categories WHERE slug = 'meeting-prep'),
'Difficult Conversation Prep',
'Prepare talking points for challenging discussions',
'Help prepare for a difficult conversation about [topic] with [person/group]. Context: [background]. Goals: [desired outcomes]. Prepare: opening statement, key messages (3 max), anticipated pushback with responses, and a closing that preserves the relationship. Tone should be [direct/empathetic/collaborative].',
'Difficult conversations, communication preparation, conflict resolution'),

((SELECT id FROM prompt_categories WHERE slug = 'meeting-prep'),
'All-Hands Meeting Planning',
'Plan engaging all-hands or town hall meetings',
'Plan an all-hands meeting for [date]. Attendees: [number]. Duration: [time]. Topics to cover: [list]. Include: agenda with time allocations, speaker assignments, employee Q&A format, engagement elements (polls, recognition, etc.), technical requirements, and follow-up communication plan.',
'All-hands meetings, company events, employee communication'),

((SELECT id FROM prompt_categories WHERE slug = 'meeting-prep'),
'Meeting Follow-Up Template',
'Create effective meeting follow-up communications',
'Create a meeting follow-up email template for [meeting type]. Include: thank you, summary of key decisions, action items with owners and deadlines, next steps, and any attachments promised. Keep it concise but complete. Format for easy scanning.',
'Follow-up, meeting documentation, action tracking'),

((SELECT id FROM prompt_categories WHERE slug = 'meeting-prep'),
'Conference Room Setup Guide',
'Standardize conference room preparation',
'Create a conference room setup guide for [room name]. Include: technology instructions (video conferencing, screen sharing, audio), catering setup, climate control, whiteboard supplies, emergency contacts, and reset checklist for after meetings. Format as a laminated card for the room.',
'Room setup, facilities, meeting logistics'),

((SELECT id FROM prompt_categories WHERE slug = 'meeting-prep'),
'Investor Meeting Prep',
'Prepare for investor or analyst meetings',
'Prepare for an investor meeting with [firm/analyst name] on [date]. Include: investor background and focus, our messaging/talking points, financial data to have ready, recent analyst reports to review, competitive questions to anticipate, and materials to leave behind.',
'Investor relations, financial meetings, executive support'),

((SELECT id FROM prompt_categories WHERE slug = 'meeting-prep'),
'Strategic Planning Session Design',
'Structure effective strategic planning meetings',
'Design a strategic planning session for [duration]. Attendees: [leadership team description]. Goals: [what you want to accomplish]. Create: agenda, pre-work assignments, facilitation approach, breakout activities, decision-making framework, and expected outputs.',
'Strategic planning, offsites, facilitation'),

((SELECT id FROM prompt_categories WHERE slug = 'meeting-prep'),
'Meeting Time Zone Coordinator',
'Find optimal meeting times across time zones',
'Find optimal meeting times for attendees in: [list cities/time zones]. Duration needed: [length]. Constraints: [any limits like "no earlier than 8am local"]. Provide 3 options with times in each zone. Also draft the meeting invite with time zone clarity.',
'Time zone management, global meetings, scheduling'),

((SELECT id FROM prompt_categories WHERE slug = 'meeting-prep'),
'Vendor Pitch Evaluation',
'Prepare to evaluate vendor presentations',
'Create an evaluation framework for vendor presentations for [product/service]. Vendors presenting: [list]. Create: evaluation criteria with weighting, questions to ask each vendor, comparison matrix template, and post-presentation debrief format. Include both technical and business considerations.',
'Vendor evaluation, procurement, decision support'),

((SELECT id FROM prompt_categories WHERE slug = 'meeting-prep'),
'Meeting Minutes Template',
'Capture meeting notes effectively',
'Create a meeting minutes template for [meeting type]. Include: meeting details header, attendees (present/absent), agenda items discussed, decisions made, action items (task, owner, deadline), open issues, and next meeting info. Format for quick data entry during meeting.',
'Meeting minutes, documentation, note-taking'),

((SELECT id FROM prompt_categories WHERE slug = 'meeting-prep'),
'Video Conference Best Practices',
'Share video meeting etiquette and tips',
'Create a video conference best practices guide for our team. Include: technical setup, professional background and lighting, audio etiquette (muting), engagement tips, screen sharing preparation, and troubleshooting common issues. Keep it concise enough to read in 2 minutes.',
'Video conferencing, remote work, meeting effectiveness'),

((SELECT id FROM prompt_categories WHERE slug = 'meeting-prep'),
'Quarterly Business Review Prep',
'Prepare for quarterly review meetings',
'Prepare for a Quarterly Business Review on [date]. Review period: Q[X]. Include: key metrics summary, highlights and lowlights, progress against goals, customer/client updates, challenges and mitigations, and priorities for next quarter. Create both the pre-read and presentation outline.',
'Quarterly reviews, performance reporting, business updates'),

((SELECT id FROM prompt_categories WHERE slug = 'meeting-prep'),
'External Meeting Pre-Flight',
'Final checks before external-facing meetings',
'Create a pre-flight checklist for external meetings. Cover: 24 hours before (confirmations, materials), 2 hours before (logistics, technology), 30 minutes before (final prep), and at meeting start. Include specific checks for [in-person/virtual/hybrid] format.',
'External meetings, client meetings, preparation checklist');

-- Continue with remaining categories in next insert block...
-- ===========================================
-- PROMPTS - DATA VISUALIZATION (20 prompts)
-- ===========================================
INSERT INTO prompts (category_id, title, description, prompt_text, use_cases) VALUES
((SELECT id FROM prompt_categories WHERE slug = 'data-visualization'),
'Executive Dashboard Design',
'Design an executive-level KPI dashboard',
'Design an executive dashboard for [executive role]. Key metrics they need to see: [list metrics]. Update frequency: [daily/weekly/monthly]. Include: recommended visualizations for each metric, layout, color coding for status, and drill-down capabilities. Keep it scannable in under 30 seconds.',
'Dashboard design, executive reporting, KPI tracking'),

((SELECT id FROM prompt_categories WHERE slug = 'data-visualization'),
'Chart Type Selector',
'Choose the right chart for your data',
'Help me select the right chart type for presenting: [describe data and message]. Audience: [who]. Purpose: [inform/persuade/compare]. Recommend the best chart type with rationale, suggest alternatives, and note any common mistakes to avoid with this data type.',
'Chart selection, data presentation, visualization'),

((SELECT id FROM prompt_categories WHERE slug = 'data-visualization'),
'Data Story Framework',
'Structure compelling data narratives',
'Help me create a data story from this data: [describe data set and key findings]. Audience: [who]. Goal: [what action or decision]. Structure the narrative with: hook, context, key insights (3 max), implications, and call to action. Recommend supporting visuals.',
'Data storytelling, presentations, communication'),

((SELECT id FROM prompt_categories WHERE slug = 'data-visualization'),
'Excel Chart Formatting',
'Create professional Excel chart formatting',
'Provide step-by-step instructions to format an Excel [chart type] professionally. Data: [describe]. Include: removing chart junk, color selection, font recommendations, axis formatting, data labels, and title/legend placement. Make it suitable for executive presentations.',
'Excel, chart formatting, professional presentation'),

((SELECT id FROM prompt_categories WHERE slug = 'data-visualization'),
'Comparison Visualization',
'Visualize comparisons effectively',
'Help me visualize a comparison between: [describe items being compared]. Metrics: [what is being measured]. Key message: [what should the audience take away]. Recommend visualization options, design principles, and how to highlight the key finding.',
'Comparisons, competitive analysis, decision support'),

((SELECT id FROM prompt_categories WHERE slug = 'data-visualization'),
'Trend Analysis Display',
'Show trends and patterns clearly',
'Recommend how to display trend data for: [describe data - e.g., "monthly sales over 2 years"]. I want to show: [pattern or insight]. Include: chart type, time scale, trend line recommendations, seasonality handling, and annotation suggestions.',
'Trend analysis, time series, performance tracking'),

((SELECT id FROM prompt_categories WHERE slug = 'data-visualization'),
'Geographic Data Map',
'Visualize geographic or regional data',
'Recommend how to visualize geographic data: [describe - e.g., "sales by state" or "office locations"]. Tools available: [Excel/PowerPoint/other]. Key message: [what to communicate]. Include: map type, color scale, labeling approach, and simplification tips.',
'Geographic visualization, maps, regional analysis'),

((SELECT id FROM prompt_categories WHERE slug = 'data-visualization'),
'Survey Results Presentation',
'Present survey data compellingly',
'Help me present survey results visually. Survey topic: [subject]. Key questions/results: [list]. Audience: [who]. Create: recommended visualizations for each result type, overall summary design, and how to handle open-ended responses. Prioritize clarity over complexity.',
'Survey data, research presentation, employee feedback'),

((SELECT id FROM prompt_categories WHERE slug = 'data-visualization'),
'Financial Chart Standards',
'Apply financial reporting visualization standards',
'Provide best practices for financial visualizations. Charts needed: [list - revenue, margins, forecasts, etc.]. Standards to follow: [company/industry if any]. Include: appropriate decimal places, currency formatting, variance displays, and waterfall chart guidance.',
'Financial reporting, charts, standards compliance'),

((SELECT id FROM prompt_categories WHERE slug = 'data-visualization'),
'Progress Tracker Visual',
'Show progress toward goals visually',
'Create a visual progress tracker for: [describe goal or project]. Milestones: [list]. Current status: [where we are]. Audience: [who]. Design a visualization that shows: overall progress, milestone status, remaining work, and projected completion. Keep it motivating.',
'Progress tracking, goal visualization, project status'),

((SELECT id FROM prompt_categories WHERE slug = 'data-visualization'),
'Org Chart Design',
'Create clear organizational charts',
'Design an organizational chart for [team/company]. Structure: [describe hierarchy and size]. Purpose: [onboarding/planning/communication]. Include: layout recommendations, information to include on each node, visual hierarchy, and how to handle dotted-line relationships.',
'Org charts, organizational design, team structure'),

((SELECT id FROM prompt_categories WHERE slug = 'data-visualization'),
'Data Color Strategy',
'Choose effective colors for data visualization',
'Create a color strategy for data visualizations in [context]. Number of categories: [count]. Key distinctions: [what colors need to differentiate]. Consider: brand colors, accessibility (colorblind-friendly), print vs. screen, and emotional associations. Provide hex codes.',
'Color theory, visualization design, accessibility'),

((SELECT id FROM prompt_categories WHERE slug = 'data-visualization'),
'Complex Data Simplification',
'Simplify complex data for executives',
'Help me simplify this complex data for an executive audience: [describe data complexity]. Key insights: [list]. Time available for review: [how long]. Recommend: level of detail, aggregation strategy, layers of information, and what to move to an appendix.',
'Data simplification, executive communication, clarity'),

((SELECT id FROM prompt_categories WHERE slug = 'data-visualization'),
'Before/After Comparison',
'Visualize before/after changes',
'Create a before/after visualization for: [describe what changed]. Before metrics: [data]. After metrics: [data]. Highlight: [the impact to emphasize]. Recommend visualization approach, emphasis technique, and context to include.',
'Change visualization, impact communication, transformation'),

((SELECT id FROM prompt_categories WHERE slug = 'data-visualization'),
'Infographic Layout',
'Design data-driven infographics',
'Design an infographic to communicate: [topic]. Key data points: [list]. Audience: [who]. Purpose: [share/educate/persuade]. Provide: layout recommendation, icon suggestions, flow/hierarchy, and what text to include. Keep it shareable and scannable.',
'Infographics, visual communication, data summary'),

((SELECT id FROM prompt_categories WHERE slug = 'data-visualization'),
'Dashboard Redesign Critique',
'Improve existing dashboard designs',
'Critique and improve this dashboard: [describe current design]. Problems I notice: [list issues]. Provide: specific improvement recommendations, before/after sketches, and priority order of changes. Focus on usability and information clarity.',
'Dashboard improvement, design critique, UX'),

((SELECT id FROM prompt_categories WHERE slug = 'data-visualization'),
'Real-Time Data Display',
'Design displays for real-time data',
'Design a real-time data display for: [what metrics]. Update frequency: [how often]. Display location: [wall monitor/desktop/etc.]. Include: layout, what to show vs. hide, alert thresholds, and how to handle data outages. Optimize for at-a-glance understanding.',
'Real-time dashboards, monitoring, operations'),

((SELECT id FROM prompt_categories WHERE slug = 'data-visualization'),
'Presentation Data Slides',
'Design data slides for presentations',
'Design data slides for a presentation about: [topic]. Key data points: [list]. Presentation context: [formal/casual, audience]. For each data point, recommend: slide layout, chart type, headline approach, and what to say vs. show. Follow the "one idea per slide" principle.',
'Presentation design, data slides, executive communication'),

((SELECT id FROM prompt_categories WHERE slug = 'data-visualization'),
'Benchmark Comparison Chart',
'Visualize performance against benchmarks',
'Create a visualization comparing performance to benchmarks. Our metrics: [data]. Benchmarks: [data sources]. Categories: [what is being measured]. Design a visualization that clearly shows where we excel vs. lag, with appropriate context.',
'Benchmarking, competitive analysis, performance comparison'),

((SELECT id FROM prompt_categories WHERE slug = 'data-visualization'),
'Process Flow Diagram',
'Create clear process visualizations',
'Create a process flow diagram for: [describe process]. Steps: [list]. Decision points: [list]. Include: recommended diagram type (flowchart, swimlane, etc.), symbol standards, labeling approach, and how to show exceptions and alternative paths.',
'Process documentation, workflow visualization, procedures');

-- ===========================================
-- LOUNGE CATEGORIES
-- ===========================================
INSERT INTO lounge_categories (name, slug, description, display_order) VALUES
('Prompts & Prompt Packs', 'prompts', 'Share and discuss AI prompts', 1),
('Calendar Strategy', 'calendar', 'Time management and calendar optimization', 2),
('Tools & Automations', 'tools', 'Software, apps, and automation workflows', 3),
('Career Growth', 'career', 'Professional development and advancement', 4),
('Templates & SOPs', 'templates', 'Reusable documents and procedures', 5),
('Wins & Lessons', 'wins', 'Celebrate successes and share learnings', 6);

-- ===========================================
-- SAMPLE EVENTS
-- ===========================================
INSERT INTO events (title, description, event_type, start_time, end_time, is_members_only, join_url) VALUES
('AI for Admins: Prompt Engineering 101', 'Monthly session covering practical AI prompts for executive assistants. Learn how to write effective prompts and get a free prompt pack.', 'live_session', NOW() + INTERVAL '7 days', NOW() + INTERVAL '7 days' + INTERVAL '1 hour', false, NULL),
('Member Workshop: Calendar Audit Deep Dive', 'Hands-on workshop to master the Calendar Audit tool. Bring your calendar export!', 'workshop', NOW() + INTERVAL '14 days', NOW() + INTERVAL '14 days' + INTERVAL '90 minutes', true, 'https://zoom.us/j/example'),
('AI for Admins: Automating Executive Briefings', 'Learn to use AI to create consistent, high-quality briefing documents for your executive.', 'live_session', NOW() + INTERVAL '30 days', NOW() + INTERVAL '30 days' + INTERVAL '1 hour', false, NULL),
('Member Office Hours', 'Open Q&A session for EAwiz members. Bring your questions about tools, prompts, or EA challenges.', 'office_hours', NOW() + INTERVAL '21 days', NOW() + INTERVAL '21 days' + INTERVAL '1 hour', true, 'https://zoom.us/j/example2'),
('AI for Admins: Email Automation', 'Streamline your email workflow with AI-powered templates and automation strategies.', 'live_session', NOW() + INTERVAL '60 days', NOW() + INTERVAL '60 days' + INTERVAL '1 hour', false, NULL);

-- ===========================================
-- PROMPTS - PRESENTATIONS (20 prompts)
-- ===========================================
INSERT INTO prompts (category_id, title, description, prompt_text, use_cases) VALUES
((SELECT id FROM prompt_categories WHERE slug = 'presentations'),
'Executive Presentation Outline',
'Create a structured outline for executive presentations',
'Create an outline for a presentation on [topic] for [audience]. Duration: [X minutes]. Goal: [inform/persuade/update]. Include: key messages (3 max), logical flow, supporting data points, anticipated questions, and a strong opening and closing. The executive presenting is [name/role].',
'Executive presentations, keynotes, stakeholder updates'),

((SELECT id FROM prompt_categories WHERE slug = 'presentations'),
'Slide Deck Reviewer',
'Review and improve presentation slides',
'Review this presentation: [paste slide titles/content or describe]. Audience: [who]. Purpose: [goal]. Identify: messaging clarity issues, slide overload, missing elements, logical flow problems, and opportunities to strengthen the story. Provide specific improvement suggestions.',
'Presentation review, quality assurance, communication'),

((SELECT id FROM prompt_categories WHERE slug = 'presentations'),
'Presentation Opening Hook',
'Create compelling presentation openings',
'Create 3 opening hooks for a presentation about [topic] to [audience]. The presentation goal is [outcome]. Options should include: a surprising statistic, a relevant story/scenario, and a provocative question. Each hook should be deliverable in under 30 seconds.',
'Presentation openings, audience engagement, public speaking'),

((SELECT id FROM prompt_categories WHERE slug = 'presentations'),
'Speaker Notes Writer',
'Write natural speaker notes for slides',
'Write speaker notes for these slides: [paste slide content]. Presentation context: [topic and audience]. Notes should be conversational (not scripted), include transition phrases, highlight key points to emphasize, and note where to pause or engage the audience. Time per slide: [X minutes].',
'Speaker notes, presentation prep, public speaking'),

((SELECT id FROM prompt_categories WHERE slug = 'presentations'),
'Q&A Preparation Guide',
'Anticipate and prepare for audience questions',
'Anticipate questions for a presentation on [topic] to [audience]. Context: [sensitive areas or known concerns]. Provide: 10 likely questions, recommended responses, pivot techniques for difficult questions, and questions to ask if there is silence. Include both softball and challenging questions.',
'Q&A preparation, objection handling, audience management'),

((SELECT id FROM prompt_categories WHERE slug = 'presentations'),
'Presentation Storyline',
'Structure a compelling narrative arc',
'Create a storyline for a presentation about [topic]. Current situation: [context]. Key message: [what you want them to remember]. Desired action: [what you want them to do]. Structure using: situation-complication-resolution format. Include emotional peaks and a clear call to action.',
'Storytelling, narrative structure, persuasive presentations'),

((SELECT id FROM prompt_categories WHERE slug = 'presentations'),
'Technical to Non-Technical Translation',
'Simplify complex topics for general audiences',
'Simplify this technical content for a non-technical audience: [paste or describe technical content]. Audience: [describe their background]. Create: simplified explanation, helpful analogies, what details to keep vs. remove, and visual/diagram suggestions. Maintain accuracy while maximizing accessibility.',
'Technical communication, simplification, translation'),

((SELECT id FROM prompt_categories WHERE slug = 'presentations'),
'Presentation Handout Creator',
'Design effective leave-behind materials',
'Create a one-page handout to accompany a presentation on [topic]. Key points covered: [list]. Contact information: [details]. Include: summary of main messages, key data points, next steps, and resources for more information. Design for standalone readability.',
'Handouts, leave-behinds, follow-up materials'),

((SELECT id FROM prompt_categories WHERE slug = 'presentations'),
'Board Presentation Format',
'Format content for board-level presentations',
'Format this content for a board presentation: [paste or describe content]. Meeting context: [regular board meeting/special session/etc.]. Restructure to: executive summary format, data-first approach, decision points highlighted, and risks/mitigations clear. Keep slides minimal with details in appendix.',
'Board presentations, governance, executive communication'),

((SELECT id FROM prompt_categories WHERE slug = 'presentations'),
'Presentation Timing Script',
'Create a timed presentation script',
'Create a timing script for a [X minute] presentation on [topic]. Sections: [list]. For each section provide: time allocation, key points to cover, transition to next section. Include buffer time and note which sections can be shortened if running long.',
'Presentation timing, rehearsal, time management'),

((SELECT id FROM prompt_categories WHERE slug = 'presentations'),
'Virtual Presentation Optimizer',
'Adapt presentations for virtual delivery',
'Adapt this presentation for virtual delivery: [describe presentation]. Original format: [in-person]. Recommend: slide modifications for screen viewing, engagement checkpoints, interactive elements to add, and pacing adjustments. Address common virtual presentation pitfalls.',
'Virtual presentations, remote meetings, digital adaptation'),

((SELECT id FROM prompt_categories WHERE slug = 'presentations'),
'Presentation Recovery Scenarios',
'Prepare for presentation mishaps',
'Create recovery scripts for common presentation problems: technical failure, hostile question, lost train of thought, running over time, key stakeholder leaves, and major error in slides. For each, provide: in-the-moment response and recovery approach. Keep them natural and professional.',
'Crisis management, public speaking, presentation skills'),

((SELECT id FROM prompt_categories WHERE slug = 'presentations'),
'Data Presentation Script',
'Explain data and charts effectively',
'Write a script for presenting this data: [describe data/chart]. Key insight: [what it shows]. Audience: [who]. Include: how to introduce the chart, where to direct attention, what the numbers mean in context, and the "so what" takeaway. Avoid just reading the chart.',
'Data presentation, chart explanation, analytics'),

((SELECT id FROM prompt_categories WHERE slug = 'presentations'),
'Presentation Call to Action',
'Create compelling calls to action',
'Create a call to action for a presentation about [topic]. Audience: [who]. Desired outcome: [what you want them to do]. Provide: 3 options from subtle to direct, language that creates urgency without pressure, and follow-up mechanism. Make the next step crystal clear.',
'Calls to action, persuasion, next steps'),

((SELECT id FROM prompt_categories WHERE slug = 'presentations'),
'Multi-Presenter Coordination',
'Coordinate presentations with multiple speakers',
'Create a coordination plan for a presentation with multiple speakers: [list speakers and topics]. Total time: [duration]. Include: transition scripts between speakers, unified messaging framework, visual consistency guidelines, and rehearsal schedule. Ensure seamless handoffs.',
'Multi-presenter, team presentations, coordination'),

((SELECT id FROM prompt_categories WHERE slug = 'presentations'),
'Presentation Feedback Request',
'Request constructive presentation feedback',
'Create a presentation feedback form for [presentation name]. Areas to evaluate: content clarity, visual design, delivery, pacing, and engagement. Include: rating scales and open-ended questions. Design for quick completion (under 2 minutes) while gathering actionable insights.',
'Feedback, improvement, presentation development'),

((SELECT id FROM prompt_categories WHERE slug = 'presentations'),
'Elevator Pitch Presentation',
'Create concise pitch presentations',
'Create a [30-second/1-minute/3-minute] pitch presentation for [topic/product/idea]. Audience: [who]. Goal: [get meeting/funding/approval]. Include: hook, problem statement, solution, unique value, and ask. Make every word count. Provide both slide content and speaking script.',
'Pitch presentations, elevator pitch, concise communication'),

((SELECT id FROM prompt_categories WHERE slug = 'presentations'),
'Presentation Accessibility Check',
'Ensure presentations are accessible',
'Review this presentation for accessibility: [describe slides]. Check for: color contrast, font readability, alt text needs, logical reading order, and captioning requirements. Provide specific fixes and explain why each matters. Include accommodations for virtual delivery.',
'Accessibility, inclusive design, ADA compliance'),

((SELECT id FROM prompt_categories WHERE slug = 'presentations'),
'Crisis Communication Presentation',
'Structure sensitive topic presentations',
'Structure a presentation for communicating [sensitive topic: layoffs/bad news/change]. Audience: [who]. Key messages: [list]. Create: empathetic opening, clear facts presentation, what-this-means section, support resources, and Q&A guidance. Tone should be honest and compassionate.',
'Crisis communication, sensitive topics, change management'),

((SELECT id FROM prompt_categories WHERE slug = 'presentations'),
'Presentation Template Creation',
'Design reusable presentation templates',
'Design a presentation template for [use case: quarterly updates/project proposals/etc.]. Company branding: [describe]. Include: slide layouts needed, placeholder content, speaker notes prompts, and usage guidelines. Make it easy for others to create consistent presentations.',
'Templates, standardization, brand consistency');

-- ===========================================
-- PROMPTS - REPORTS (20 prompts)
-- ===========================================
INSERT INTO prompts (category_id, title, description, prompt_text, use_cases) VALUES
((SELECT id FROM prompt_categories WHERE slug = 'reports'),
'Executive Summary Writer',
'Create compelling executive summaries',
'Write an executive summary for this report: [paste or describe report content]. Audience: [who]. Length: [word count or paragraph count]. Include: key findings, implications, and recommendations. Make it standalone - the reader should understand the essence without reading the full report.',
'Executive summaries, report writing, communication'),

((SELECT id FROM prompt_categories WHERE slug = 'reports'),
'Weekly Status Report Template',
'Create consistent weekly status updates',
'Create a weekly status report template for [role/department]. Stakeholders: [who reads this]. Include sections for: accomplishments, in-progress items, upcoming priorities, blockers/risks, and key metrics. Design for 5-minute creation and 2-minute reading.',
'Status reports, weekly updates, communication'),

((SELECT id FROM prompt_categories WHERE slug = 'reports'),
'Board Report Format',
'Format reports for board consumption',
'Format this information for a board report: [paste or describe content]. Board type: [corporate/nonprofit/advisory]. Include: executive summary, key metrics dashboard, strategic implications, risks and mitigations, and recommendations. Use board-appropriate language and level of detail.',
'Board reports, governance, executive communication'),

((SELECT id FROM prompt_categories WHERE slug = 'reports'),
'Quarterly Business Review Report',
'Structure comprehensive QBR reports',
'Create a QBR report structure for [department/company]. Quarter: Q[X]. Include: performance vs. goals, key wins, challenges faced, lessons learned, and priorities for next quarter. For each section, suggest metrics and narratives to include.',
'Quarterly reviews, business reporting, performance tracking'),

((SELECT id FROM prompt_categories WHERE slug = 'reports'),
'Project Status Report',
'Create clear project status reports',
'Create a project status report for [project name]. Project phase: [current phase]. Include: overall status (RAG), milestone progress, budget status, resource allocation, risks and issues, and next steps. Highlight what leadership needs to know vs. operational details.',
'Project reporting, status updates, project management'),

((SELECT id FROM prompt_categories WHERE slug = 'reports'),
'Competitive Analysis Report',
'Structure competitive intelligence reports',
'Create a competitive analysis report framework for analyzing [competitor name] vs. [our company]. Areas to cover: product/service comparison, pricing, market position, strengths/weaknesses, and strategic implications. Include both data tables and narrative analysis.',
'Competitive analysis, market intelligence, strategy'),

((SELECT id FROM prompt_categories WHERE slug = 'reports'),
'Meeting Summary Report',
'Summarize meetings effectively for distribution',
'Summarize this meeting for distribution: [paste notes or describe discussion]. Attendees: [list]. Format as: key decisions made, action items with owners and deadlines, discussion highlights, and next steps. Make it useful for both attendees and those who missed it.',
'Meeting summaries, communication, documentation'),

((SELECT id FROM prompt_categories WHERE slug = 'reports'),
'Annual Report Section',
'Draft annual report content',
'Draft content for an annual report section on [topic: letter from CEO/year in review/financial highlights/etc.]. Year: [year]. Key achievements: [list]. Challenges addressed: [list]. Tone should be [formal/conversational] and align with [company culture].',
'Annual reports, corporate communication, year-end review'),

((SELECT id FROM prompt_categories WHERE slug = 'reports'),
'Incident Report Template',
'Document incidents professionally',
'Create an incident report template for [type of incident: security/safety/IT/etc.]. Include: incident details (who, what, when, where), immediate response taken, root cause analysis, impact assessment, corrective actions, and prevention measures. Ensure factual, non-blaming language.',
'Incident reporting, documentation, compliance'),

((SELECT id FROM prompt_categories WHERE slug = 'reports'),
'Research Summary Report',
'Summarize research findings',
'Summarize research findings from: [describe research conducted]. Key questions investigated: [list]. Present: methodology overview, key findings, limitations, and recommendations. Target length: [pages/words]. Audience: [technical level].',
'Research reports, findings summaries, analysis'),

((SELECT id FROM prompt_categories WHERE slug = 'reports'),
'Budget Variance Report',
'Explain budget variances clearly',
'Create a budget variance report for [period]. Budget: [amount]. Actual: [amount]. Variance: [amount/percentage]. Explain: major drivers of variance (both positive and negative), one-time vs. recurring factors, and forecast implications. Format for finance and non-finance audiences.',
'Budget reporting, financial analysis, variance analysis'),

((SELECT id FROM prompt_categories WHERE slug = 'reports'),
'Employee Survey Report',
'Present employee feedback professionally',
'Create a report from employee survey results. Survey topic: [engagement/satisfaction/specific topic]. Response rate: [percentage]. Key findings: [list top insights]. Include: overall scores, trend comparisons, demographic breakdowns, verbatim themes, and recommended actions.',
'Survey reports, employee feedback, HR communication'),

((SELECT id FROM prompt_categories WHERE slug = 'reports'),
'Vendor Performance Report',
'Document vendor performance',
'Create a vendor performance report for [vendor name]. Contract period: [dates]. Metrics tracked: [list]. Include: scorecard with ratings, specific performance examples (positive and negative), contract compliance status, and recommendation for renewal/action.',
'Vendor management, performance tracking, procurement'),

((SELECT id FROM prompt_categories WHERE slug = 'reports'),
'Training Report',
'Document training completion and effectiveness',
'Create a training report for [training program]. Participants: [number]. Completion rate: [percentage]. Include: learning objectives achievement, participant feedback summary, knowledge assessment results, and recommendations for future sessions.',
'Training documentation, L&D reporting, HR'),

((SELECT id FROM prompt_categories WHERE slug = 'reports'),
'Risk Assessment Report',
'Document risk assessments',
'Create a risk assessment report for [project/initiative/operation]. Include: risk identification methodology, risk register with likelihood and impact ratings, prioritized risk list, mitigation strategies, and monitoring approach. Use heat map or matrix visualization.',
'Risk management, assessment reports, governance'),

((SELECT id FROM prompt_categories WHERE slug = 'reports'),
'Post-Event Report',
'Document event outcomes and learnings',
'Create a post-event report for [event name] on [date]. Include: attendance vs. goal, budget vs. actual, agenda delivered, feedback summary, what worked well, what to improve, and recommendations for next time. Add photos and key metrics.',
'Event reports, post-mortem, documentation'),

((SELECT id FROM prompt_categories WHERE slug = 'reports'),
'Due Diligence Report',
'Structure due diligence findings',
'Structure a due diligence report for [purpose: vendor selection/partnership/acquisition]. Subject: [company/individual]. Areas covered: [list]. For each area, document: findings, red flags, positive indicators, and outstanding questions. Maintain objective, evidence-based tone.',
'Due diligence, investigations, decision support'),

((SELECT id FROM prompt_categories WHERE slug = 'reports'),
'Customer Feedback Report',
'Synthesize customer feedback',
'Synthesize customer feedback from [source: surveys/reviews/calls]. Time period: [dates]. Create: quantitative summary, sentiment analysis, top themes (positive and negative), notable quotes, and recommended actions. Prioritize actionable insights.',
'Customer feedback, VOC reports, service improvement'),

((SELECT id FROM prompt_categories WHERE slug = 'reports'),
'Compliance Report',
'Document compliance status',
'Create a compliance report for [regulation/policy]. Reporting period: [dates]. Include: compliance status by requirement, any violations or gaps, remediation actions taken, outstanding items, and attestation. Format for [internal/external audit] consumption.',
'Compliance reporting, audit, regulatory'),

((SELECT id FROM prompt_categories WHERE slug = 'reports'),
'Report Formatting Guidelines',
'Establish report standards',
'Create report formatting guidelines for [department/company]. Cover: standard sections and order, heading hierarchy, data visualization standards, citation format, branding elements, and templates to use. Goal is consistency across all reports produced.',
'Standards, templates, documentation quality');

-- ===========================================
-- PROMPTS - PROFESSIONAL DEVELOPMENT (20 prompts)
-- ===========================================
INSERT INTO prompts (category_id, title, description, prompt_text, use_cases) VALUES
((SELECT id FROM prompt_categories WHERE slug = 'professional-development'),
'Learning Goal Framework',
'Set effective professional development goals',
'Help me set professional development goals for [time period]. Current role: [title]. Career aspirations: [describe]. Areas I want to develop: [list]. Create SMART goals with: specific skill outcomes, learning activities, milestones, and success metrics. Balance stretch with achievability.',
'Goal setting, career development, learning planning'),

((SELECT id FROM prompt_categories WHERE slug = 'professional-development'),
'Course Evaluation Matrix',
'Compare learning opportunities',
'Compare these learning opportunities: [list courses/programs]. My learning goals: [describe]. Budget: [amount]. Time available: [hours/week]. Evaluate: content relevance, credential value, time commitment, cost, format flexibility, and reviews. Recommend best option with rationale.',
'Course selection, training evaluation, investment decisions'),

((SELECT id FROM prompt_categories WHERE slug = 'professional-development'),
'Skill Assessment Inventory',
'Evaluate current skills and gaps',
'Conduct a skill assessment for [role type]. My background: [describe]. Rate my proficiency (1-5) in: [list skills from job descriptions or competency models]. Identify: strength areas to leverage, critical gaps to address, and emerging skills to develop.',
'Skills assessment, gap analysis, career planning'),

((SELECT id FROM prompt_categories WHERE slug = 'professional-development'),
'Conference Maximization Plan',
'Get maximum value from conferences',
'Create a plan to maximize value from [conference name]. My goals: [learning/networking/visibility]. Sessions I am considering: [list if known]. Create: pre-conference preparation, session selection strategy, networking approach, and post-conference follow-up plan.',
'Conference attendance, networking, professional events'),

((SELECT id FROM prompt_categories WHERE slug = 'professional-development'),
'Book Summary and Action Items',
'Extract actionable insights from professional books',
'I just read [book title] by [author]. Key concepts that resonated: [list]. Help me create: summary of main ideas, specific actions I can take in my role as [title], discussion points for my team, and related resources to explore.',
'Book learning, application, knowledge sharing'),

((SELECT id FROM prompt_categories WHERE slug = 'professional-development'),
'Mentorship Conversation Guide',
'Prepare for mentorship sessions',
'Prepare for a mentorship session with [mentor name/role]. Topics I want to discuss: [list]. Challenges I am facing: [describe]. Create: specific questions to ask, how to frame challenges for input, topics to avoid (if any), and follow-up actions to propose.',
'Mentorship, career guidance, professional relationships'),

((SELECT id FROM prompt_categories WHERE slug = 'professional-development'),
'Certification Study Plan',
'Plan for professional certification',
'Create a study plan for [certification name]. Exam date: [date or target]. Study time available: [hours/week]. Current knowledge level: [beginner/intermediate]. Include: content breakdown, study schedule, practice resources, and exam strategies.',
'Certification prep, studying, professional credentials'),

((SELECT id FROM prompt_categories WHERE slug = 'professional-development'),
'Peer Learning Circle Setup',
'Organize peer learning groups',
'Design a peer learning circle for [topic/skill]. Participants: [number and backgrounds]. Duration: [weeks/months]. Create: meeting cadence, discussion topics for each session, accountability structure, and resources to share. Keep it sustainable for busy professionals.',
'Peer learning, cohort learning, skill development'),

((SELECT id FROM prompt_categories WHERE slug = 'professional-development'),
'Stretch Assignment Proposal',
'Propose developmental stretch assignments',
'Draft a proposal for a stretch assignment to develop [skill/experience]. Current role: [title]. Proposed assignment: [describe or ask for suggestions]. Include: learning objectives, how I will maintain core responsibilities, support needed, and expected outcomes.',
'Stretch assignments, development, career growth'),

((SELECT id FROM prompt_categories WHERE slug = 'professional-development'),
'Professional Development Budget Request',
'Justify professional development investment',
'Draft a request for professional development funding. Opportunity: [course/certification/conference]. Cost: [amount]. Create: business case connecting to job/company goals, expected ROI, how I will share learnings, and alternative options considered. Keep it compelling but realistic.',
'Funding requests, L&D, career investment'),

((SELECT id FROM prompt_categories WHERE slug = 'professional-development'),
'Learning Reflection Template',
'Process and retain learning',
'Create a reflection template for after [training/course/experience]. Include: key takeaways, how this applies to my role, questions that remain, action items, and what I would share with colleagues. Design for quick completion while maximizing retention.',
'Learning retention, reflection, knowledge management'),

((SELECT id FROM prompt_categories WHERE slug = 'professional-development'),
'Shadow Experience Request',
'Request job shadowing opportunities',
'Draft a request to shadow [person/role] to learn about [area]. Duration: [proposed time]. Purpose: [learning objectives]. Include: what I hope to observe, questions I have, how I will minimize disruption, and how I will apply learnings.',
'Job shadowing, experiential learning, cross-functional exposure'),

((SELECT id FROM prompt_categories WHERE slug = 'professional-development'),
'Microlearning Habit System',
'Build consistent learning habits',
'Design a microlearning system for developing [skill]. Time available: [minutes/day]. Create: curated resources, daily learning routine, spaced repetition approach, and progress tracking method. Make it sustainable and integrated with existing workflow.',
'Microlearning, habits, continuous learning'),

((SELECT id FROM prompt_categories WHERE slug = 'professional-development'),
'Teaching to Learn Plan',
'Deepen learning by teaching others',
'Create a plan to teach [topic I am learning] to others. My current level: [beginner/intermediate]. Audience: [who I could teach]. Design: teaching format, content outline, how teaching will deepen my understanding, and feedback collection approach.',
'Teaching, knowledge sharing, learning reinforcement'),

((SELECT id FROM prompt_categories WHERE slug = 'professional-development'),
'Career Pivot Research',
'Research potential career transitions',
'Research transitioning from [current role] to [target role]. Create: skills gap analysis, transferable strengths, typical transition paths, networking targets, and timeline expectations. Be realistic about challenges while highlighting opportunities.',
'Career change, pivots, transition planning'),

((SELECT id FROM prompt_categories WHERE slug = 'professional-development'),
'Professional Reading List',
'Curate relevant professional reading',
'Curate a professional reading list for [role/skill area]. Categories to include: foundational knowledge, current trends, practical application, and thought leadership. For each recommendation, provide: title, author, why it is relevant, and time to read.',
'Reading lists, professional books, knowledge building'),

((SELECT id FROM prompt_categories WHERE slug = 'professional-development'),
'Skill Building Side Project',
'Design learning-oriented side projects',
'Design a side project to develop [skill]. Time commitment: [hours/week]. Current skill level: [describe]. Create: project scope, learning milestones, resources needed, and how to document/showcase the work. Make it achievable and portfolio-worthy.',
'Side projects, portfolio building, practical learning'),

((SELECT id FROM prompt_categories WHERE slug = 'professional-development'),
'Industry Knowledge Building',
'Stay current on industry trends',
'Create a plan to build industry knowledge in [industry/sector]. Include: key publications to follow, podcasts, industry events, people to follow on LinkedIn, and communities to join. Design for ongoing learning vs. one-time research.',
'Industry knowledge, trends, professional awareness'),

((SELECT id FROM prompt_categories WHERE slug = 'professional-development'),
'Feedback Request for Development',
'Solicit developmental feedback',
'Draft a request for feedback on [skill/competency]. Recipient: [colleague/manager/stakeholder]. Context: [why I want feedback]. Create: specific questions to ask, how to receive feedback gracefully, and how I will follow up on input received.',
'Feedback, 360 feedback, development'),

((SELECT id FROM prompt_categories WHERE slug = 'professional-development'),
'Development Progress Review',
'Review and adjust development plans',
'Review my development progress. Original goals: [list]. Activities completed: [list]. Results: [describe]. Create: honest assessment of progress, what worked and what did not, adjusted goals for next period, and lessons for future development planning.',
'Progress review, goal tracking, plan adjustment');

-- ===========================================
-- PROMPTS - CORRESPONDENCE (20 prompts)
-- ===========================================
INSERT INTO prompts (category_id, title, description, prompt_text, use_cases) VALUES
((SELECT id FROM prompt_categories WHERE slug = 'correspondence'),
'Executive Communication Draft',
'Draft communications on behalf of executives',
'Draft a [email/letter/message] from [executive name] to [recipient]. Purpose: [describe]. Key points to convey: [list]. Executive voice: [describe their typical tone]. Include appropriate greeting, body, and signature. Ensure it sounds like them, not a generic AI.',
'Ghost writing, executive communication, correspondence'),

((SELECT id FROM prompt_categories WHERE slug = 'correspondence'),
'Meeting Request Email',
'Request meetings professionally',
'Draft a meeting request email to [recipient]. Purpose: [topic]. Urgency: [level]. Include: clear ask, proposed times, duration needed, preparation required, and alternative if they cannot meet. Tone should be [formal/casual] and respect their time.',
'Meeting requests, scheduling, professional outreach'),

((SELECT id FROM prompt_categories WHERE slug = 'correspondence'),
'Decline Invitation Gracefully',
'Politely decline requests and invitations',
'Draft a polite decline for [invitation/request]. From: [who invited]. Reason for declining: [if sharable]. Maintain relationship by: [offering alternative/expressing interest in future opportunities]. Keep it brief, warm, and door-opening.',
'Declining invitations, professional etiquette, communication'),

((SELECT id FROM prompt_categories WHERE slug = 'correspondence'),
'Follow-Up Email Sequence',
'Create effective follow-up emails',
'Create a follow-up email sequence for [context: unanswered email/pending decision/etc.]. Original communication: [date and topic]. Draft 3 follow-ups: first (gentle nudge), second (adding value/urgency), third (final with easy out). Space appropriately.',
'Follow-up, persistence, professional communication'),

((SELECT id FROM prompt_categories WHERE slug = 'correspondence'),
'Apology Email Professional',
'Apologize professionally for mistakes',
'Draft a professional apology email for [situation]. Mistake made: [describe]. Impact: [what was affected]. Include: sincere acknowledgment, take responsibility (no excuses), corrective action taken, and prevention plan. Tone: professional and genuine.',
'Apologies, mistake handling, professional recovery'),

((SELECT id FROM prompt_categories WHERE slug = 'correspondence'),
'Congratulations Message',
'Write meaningful congratulations',
'Draft a congratulations message to [person] for [achievement/milestone]. My relationship to them: [describe]. Make it: specific to their achievement, genuine in tone, and memorable. Avoid generic phrases. Length: [brief note/fuller message].',
'Congratulations, recognition, professional relationships'),

((SELECT id FROM prompt_categories WHERE slug = 'correspondence'),
'Condolence Message Professional',
'Write appropriate sympathy messages',
'Draft a professional condolence message to [recipient] regarding [loss/situation]. Our relationship: [describe]. Keep it: sincere, brief, supportive without being presumptuous, and offer appropriate support. Avoid cliches and focus on genuine caring.',
'Condolences, sympathy, sensitive communication'),

((SELECT id FROM prompt_categories WHERE slug = 'correspondence'),
'Introduction Email Two Parties',
'Introduce two people effectively',
'Draft an introduction email connecting [Person A] and [Person B]. Why they should meet: [reason]. Their backgrounds: [brief descriptions]. Include: context for the connection, what each brings to the table, and suggested next step. CC both or send separately: [preference].',
'Introductions, networking, relationship building'),

((SELECT id FROM prompt_categories WHERE slug = 'correspondence'),
'Request for Information',
'Request information professionally',
'Draft an information request to [recipient/department]. Information needed: [describe]. Purpose: [why you need it]. Deadline: [if any]. Include: specific questions, format preferred, and offer to provide context if helpful. Be respectful of their workload.',
'Information requests, cross-functional communication'),

((SELECT id FROM prompt_categories WHERE slug = 'correspondence'),
'Thank You Letter Formal',
'Write impactful thank you letters',
'Write a formal thank you letter to [recipient] for [what they did]. Context: [event/favor/gift/opportunity]. Make it: specific about what you appreciated, describe impact on you, and express genuine gratitude. Handwritten or email: [format].',
'Thank you letters, gratitude, professional relationships'),

((SELECT id FROM prompt_categories WHERE slug = 'correspondence'),
'Bad News Delivery Email',
'Communicate bad news with sensitivity',
'Draft an email delivering bad news: [describe situation]. Recipient: [who]. Include: clear statement of the news (no burying the lead), context/reason, what happens next, and support available. Be direct but compassionate.',
'Bad news delivery, sensitive communication, change management'),

((SELECT id FROM prompt_categories WHERE slug = 'correspondence'),
'Reference Request',
'Request professional references',
'Draft a reference request to [person]. Position I am applying for: [role at company]. Our relationship: [how we worked together]. Request: [reference letter/to be listed as reference]. Make it easy for them to say yes or gracefully decline.',
'References, job search, professional requests'),

((SELECT id FROM prompt_categories WHERE slug = 'correspondence'),
'Vendor Communication',
'Communicate with vendors professionally',
'Draft a [type: inquiry/complaint/appreciation/negotiation] to [vendor/company]. Context: [describe situation]. Desired outcome: [what you want]. Maintain professional tone while being clear about expectations. Include relevant account/order details.',
'Vendor management, customer communication, business correspondence'),

((SELECT id FROM prompt_categories WHERE slug = 'correspondence'),
'Out of Office Message',
'Create informative OOO messages',
'Create an out-of-office message for [dates]. Context: [vacation/conference/leave]. Include: dates unavailable, emergency contact, expected response time when back, and any interim coverage. Tone: [professional/friendly]. For [internal/external/both] audiences.',
'Out of office, auto-reply, communication'),

((SELECT id FROM prompt_categories WHERE slug = 'correspondence'),
'Announcement Draft',
'Draft organizational announcements',
'Draft an announcement about [news: new hire/departure/policy change/achievement]. Audience: [internal/external/specific group]. Include: the news clearly stated, relevant context, what it means for the audience, and any action required. Tone: [appropriate for news type].',
'Announcements, organizational communication, internal comms'),

((SELECT id FROM prompt_categories WHERE slug = 'correspondence'),
'Rescheduling Request',
'Request meeting changes professionally',
'Draft a rescheduling request for [meeting] originally on [date]. Reason for change: [brief if appropriate]. Offer: [2-3 alternative times]. Express: regret for inconvenience while being efficient about the ask. Consider their time and flexibility.',
'Rescheduling, calendar management, professional courtesy'),

((SELECT id FROM prompt_categories WHERE slug = 'correspondence'),
'Escalation Email',
'Escalate issues professionally',
'Draft an escalation email about [issue] to [higher authority]. Previous attempts to resolve: [describe]. Current status: [where things stand]. Request: [specific action needed]. Be factual, not emotional. Include timeline and impact if not resolved.',
'Escalation, problem resolution, stakeholder management'),

((SELECT id FROM prompt_categories WHERE slug = 'correspondence'),
'Collaboration Request',
'Request collaboration across teams',
'Draft a collaboration request to [team/person]. Project: [describe]. Why their involvement matters: [explain]. What you need: [specific ask]. What you offer: [value to them]. Timing: [when]. Make it appealing and respectful of their priorities.',
'Collaboration, cross-functional work, teamwork'),

((SELECT id FROM prompt_categories WHERE slug = 'correspondence'),
'Status Update to Stakeholders',
'Update stakeholders effectively',
'Draft a status update to [stakeholders] about [project/initiative]. Period covered: [dates]. Include: progress highlights, challenges/risks, upcoming milestones, and any decisions/input needed. Format for quick scanning while ensuring key points register.',
'Status updates, stakeholder communication, project management'),

((SELECT id FROM prompt_categories WHERE slug = 'correspondence'),
'Farewell Message Professional',
'Write professional departure messages',
'Draft a farewell message as I leave [company/team]. Duration in role: [time]. Highlights: [memorable moments]. Next step: [if sharing]. Include: gratitude, personal touches, contact info for staying in touch. Avoid negativity, focus on appreciation.',
'Farewell, career transitions, professional relationships');

-- ===========================================
-- PROMPTS - BUDGETS (20 prompts)
-- ===========================================
INSERT INTO prompts (category_id, title, description, prompt_text, use_cases) VALUES
((SELECT id FROM prompt_categories WHERE slug = 'budgets'),
'Department Budget Template',
'Create comprehensive department budgets',
'Create a department budget template for [department]. Fiscal year: [year]. Include categories for: personnel, operations, travel, technology, professional development, and contingency. Add formulas for totals and variance tracking. Design for both planning and monthly tracking.',
'Department budgets, annual planning, financial management'),

((SELECT id FROM prompt_categories WHERE slug = 'budgets'),
'Budget Justification Narrative',
'Write compelling budget justifications',
'Write a budget justification for [item/category] in the amount of [cost]. Purpose: [what it supports]. Include: business need, ROI or value delivered, alternatives considered, and consequences of not funding. Make the case compelling but realistic.',
'Budget justifications, funding requests, business cases'),

((SELECT id FROM prompt_categories WHERE slug = 'budgets'),
'Event Budget Planning',
'Create detailed event budgets',
'Create an event budget for [event name]. Expected attendance: [number]. Event type: [conference/dinner/offsite/etc.]. Include: venue, catering, AV, materials, travel, entertainment, staffing, and contingency. Add per-person cost calculation.',
'Event budgets, event planning, cost management'),

((SELECT id FROM prompt_categories WHERE slug = 'budgets'),
'Budget Variance Analysis',
'Analyze and explain budget variances',
'Analyze budget variance for [period]. Budget: [amount]. Actual: [amount]. Variance: [amount and percentage]. Explain: main drivers of variance, controllable vs. uncontrollable factors, one-time vs. ongoing impacts, and recommendations. Present for finance and leadership audiences.',
'Variance analysis, financial reporting, budget management'),

((SELECT id FROM prompt_categories WHERE slug = 'budgets'),
'Cost Reduction Proposal',
'Propose budget reductions systematically',
'Create a cost reduction proposal to reduce [category] spending by [amount/percentage]. Current spend: [amount]. Identify: reduction opportunities, impact assessment for each, implementation approach, and risks. Prioritize by ease of implementation and impact.',
'Cost reduction, budget cuts, efficiency'),

((SELECT id FROM prompt_categories WHERE slug = 'budgets'),
'Capital Expense Request',
'Request capital expenditures',
'Draft a capital expense request for [item/project]. Cost: [amount]. Useful life: [years]. Business justification: [why needed]. Include: problem being solved, alternatives considered, total cost of ownership, and payback period if applicable.',
'CapEx, capital planning, major purchases'),

((SELECT id FROM prompt_categories WHERE slug = 'budgets'),
'Budget Reforecast',
'Create mid-year budget reforecasts',
'Create a budget reforecast for [remainder of fiscal year]. Year-to-date actual: [amount]. Original full-year budget: [amount]. Include: known changes, anticipated adjustments, risk factors, and revised projection. Explain methodology and key assumptions.',
'Reforecasting, financial planning, budget updates'),

((SELECT id FROM prompt_categories WHERE slug = 'budgets'),
'Project Budget Tracking',
'Track project budgets effectively',
'Create a project budget tracker for [project name]. Total budget: [amount]. Phases: [list]. Include: phase allocations, actual spend tracking, committed/encumbered funds, forecasted remaining, and percentage complete. Add variance alerts.',
'Project budgets, tracking, financial control'),

((SELECT id FROM prompt_categories WHERE slug = 'budgets'),
'Budget Presentation Slides',
'Present budgets to leadership',
'Create an outline for budget presentation to [audience]. Budget being presented: [describe]. Include: executive summary, key drivers, comparison to prior year, major investments, risks and assumptions, and visual representations of key data. Time: [minutes].',
'Budget presentations, financial communication, leadership updates'),

((SELECT id FROM prompt_categories WHERE slug = 'budgets'),
'Headcount Budget Planning',
'Plan personnel/headcount budgets',
'Create a headcount budget plan for [team/department]. Current headcount: [number]. Planned changes: [describe]. Include: salary costs by position, benefits loading, vacancy factor, and total fully-loaded cost. Show timing of additions/reductions.',
'Headcount planning, personnel budgets, workforce planning'),

((SELECT id FROM prompt_categories WHERE slug = 'budgets'),
'Vendor Contract Budget',
'Budget for vendor contracts',
'Create a vendor contract budget for [vendor/category]. Contract period: [dates]. Include: base fees, variable costs, implementation costs, support/maintenance, and potential overages. Add renewal terms and price increase provisions.',
'Vendor budgets, contract management, procurement'),

((SELECT id FROM prompt_categories WHERE slug = 'budgets'),
'Training Budget Allocation',
'Allocate training and development budget',
'Create a training budget allocation for [team/department]. Total budget: [amount]. Team size: [number]. Include: per-person allocation, departmental training, certifications, conferences, and subscriptions. Balance individual and team needs.',
'Training budgets, L&D, professional development'),

((SELECT id FROM prompt_categories WHERE slug = 'budgets'),
'Budget Approval Workflow',
'Design budget approval processes',
'Design a budget approval workflow for [expense type]. Thresholds: [list approval levels]. Include: request form template, required documentation, approval chain, timeline expectations, and escalation process. Make it clear and efficient.',
'Approval workflows, governance, process design'),

((SELECT id FROM prompt_categories WHERE slug = 'budgets'),
'Zero-Based Budget Review',
'Conduct zero-based budget analysis',
'Conduct a zero-based budget review for [category/department]. Current spend: [amount]. For each line item: question necessity, evaluate right-sizing, identify alternatives, and provide recommendations. Assume nothing is sacred, but be pragmatic.',
'Zero-based budgeting, cost analysis, efficiency'),

((SELECT id FROM prompt_categories WHERE slug = 'budgets'),
'Budget Calendar Creation',
'Create annual budgeting timelines',
'Create a budget calendar for [fiscal year]. Include: kickoff, department submissions, consolidation, reviews, leadership approval, board approval, and communication. Add key milestones and responsible parties. Account for holidays and competing priorities.',
'Budget process, planning calendar, timeline management'),

((SELECT id FROM prompt_categories WHERE slug = 'budgets'),
'Contingency Budget Planning',
'Plan for budget contingencies',
'Create a contingency budget plan for [department/project]. Base budget: [amount]. Contingency requested: [percentage]. Identify: potential needs for contingency, triggers for release, approval process, and tracking methodology. Balance preparedness with fiscal responsibility.',
'Contingency planning, risk management, financial planning'),

((SELECT id FROM prompt_categories WHERE slug = 'budgets'),
'Budget vs Forecast Report',
'Compare budgets to forecasts',
'Create a budget vs. forecast report for [period]. Original budget: [amount]. Current forecast: [amount]. Include: summary of changes, drivers of forecast changes, impact on annual numbers, and confidence level. Format for leadership review.',
'Budget vs forecast, financial reporting, variance tracking'),

((SELECT id FROM prompt_categories WHERE slug = 'budgets'),
'Cost Allocation Model',
'Allocate shared costs fairly',
'Design a cost allocation model for [shared service/cost]. Total cost to allocate: [amount]. Departments involved: [list]. Recommend: allocation methodology, calculate each department share, and document rationale. Ensure perceived fairness.',
'Cost allocation, shared services, internal charging'),

((SELECT id FROM prompt_categories WHERE slug = 'budgets'),
'Budget Scenario Planning',
'Model budget scenarios',
'Create budget scenarios for [purpose]. Base case: [amount]. Model: best case (+[X]%), worst case (-[X]%), and [custom scenario]. For each scenario: identify impacts, required actions, and decision points. Help leadership prepare for different outcomes.',
'Scenario planning, sensitivity analysis, contingency planning'),

((SELECT id FROM prompt_categories WHERE slug = 'budgets'),
'Annual Budget Instructions',
'Create budget preparation guidance',
'Create budget preparation instructions for [fiscal year]. Include: timeline, templates to use, assumptions provided, how to submit, review process, and FAQs. Target audience: department managers preparing budgets. Make it clear and actionable.',
'Budget instructions, process documentation, guidance');

-- ===========================================
-- PROMPTS - TEAM BUILDING (20 prompts)
-- ===========================================
INSERT INTO prompts (category_id, title, description, prompt_text, use_cases) VALUES
((SELECT id FROM prompt_categories WHERE slug = 'team-building'),
'Team Icebreaker Questions',
'Generate engaging icebreaker questions',
'Generate 15 icebreaker questions for a [team size] team. Context: [new team/quarterly meeting/offsite]. Team culture: [describe]. Mix: lighthearted, thought-provoking, and work-related. Avoid anything too personal or controversial. Include time estimate for each.',
'Icebreakers, team meetings, engagement'),

((SELECT id FROM prompt_categories WHERE slug = 'team-building'),
'Virtual Team Activity',
'Plan engaging virtual team activities',
'Plan a virtual team activity for [number] people. Duration: [time]. Goals: [connection/celebration/energizing]. Budget: [per person if any]. Recommend: specific activity with instructions, materials needed, facilitation tips, and backup plan if tech fails.',
'Virtual teams, remote engagement, team activities'),

((SELECT id FROM prompt_categories WHERE slug = 'team-building'),
'Team Offsite Agenda',
'Design effective team offsite agendas',
'Design a team offsite agenda for [number] people over [duration]. Goals: [strategic planning/team building/combination]. Include: balanced mix of work and connection, energizer activities, break timing, and flexibility buffers. Location: [onsite/offsite venue].',
'Team offsites, retreats, team development'),

((SELECT id FROM prompt_categories WHERE slug = 'team-building'),
'New Team Member Welcome Plan',
'Onboard new team members warmly',
'Create a welcome plan for a new team member. Role: [position]. Team size: [number]. Include: pre-arrival preparation, first day activities, meet-and-greet schedule, buddy assignment, and first month milestones. Balance warm welcome with productive onboarding.',
'Onboarding, new hire welcome, team integration'),

((SELECT id FROM prompt_categories WHERE slug = 'team-building'),
'Team Recognition Program',
'Design peer recognition programs',
'Design a team recognition program for [team size] team. Budget: [amount/month or none]. Include: recognition categories, nomination process, selection criteria, recognition format, and celebration approach. Make it meaningful without being cumbersome.',
'Recognition, appreciation, team morale'),

((SELECT id FROM prompt_categories WHERE slug = 'team-building'),
'Team Communication Norms',
'Establish team communication guidelines',
'Create team communication norms for a [remote/hybrid/in-person] team of [number] people. Cover: preferred channels for different message types, response time expectations, meeting etiquette, and after-hours communication. Get buy-in through collaborative approach.',
'Communication norms, team agreements, working arrangements'),

((SELECT id FROM prompt_categories WHERE slug = 'team-building'),
'Conflict Resolution Guide',
'Handle team conflicts constructively',
'Create a conflict resolution guide for [team/manager]. Common conflict scenarios: [describe if known]. Include: early warning signs, conversation frameworks, mediation approach, escalation criteria, and documentation needs. Focus on resolution while maintaining relationships.',
'Conflict resolution, team dynamics, management'),

((SELECT id FROM prompt_categories WHERE slug = 'team-building'),
'Team Retrospective Facilitation',
'Facilitate team retrospectives',
'Design a retrospective format for a team of [number]. Recent project/period: [describe]. Goals: [learning/improvement/celebration]. Duration: [time]. Include: activities, discussion prompts, anonymous feedback options, and action item capture. Keep it engaging, not tedious.',
'Retrospectives, continuous improvement, team learning'),

((SELECT id FROM prompt_categories WHERE slug = 'team-building'),
'Cross-Team Collaboration Event',
'Build bridges between teams',
'Design an event to improve collaboration between [Team A] and [Team B]. Current relationship: [describe]. Goals: [understanding/process improvement/relationship building]. Duration: [time]. Create: activities that surface both teams perspectives and build shared understanding.',
'Cross-functional collaboration, relationship building, silos'),

((SELECT id FROM prompt_categories WHERE slug = 'team-building'),
'Team Values Exercise',
'Define and reinforce team values',
'Facilitate a team values exercise for [number] people. Duration: [time]. Purpose: [define new values/reinforce existing]. Include: values identification activities, prioritization method, behavioral definition for each value, and integration plan.',
'Team values, culture, alignment'),

((SELECT id FROM prompt_categories WHERE slug = 'team-building'),
'Celebration and Milestones',
'Celebrate team achievements',
'Plan a celebration for [achievement/milestone]. Team size: [number]. Budget: [amount]. Constraints: [remote/time zones/dietary]. Create: celebration format, recognition elements, participation opportunities, and memorable touches. Make everyone feel included.',
'Celebrations, milestones, team morale'),

((SELECT id FROM prompt_categories WHERE slug = 'team-building'),
'Team Strengths Discovery',
'Leverage team member strengths',
'Design a team strengths discovery session for [number] people. Duration: [time]. Tool: [StrengthsFinder/MBTI/informal]. Include: individual reflection, sharing exercise, how strengths complement each other, and application to current work. Focus on appreciation, not labels.',
'Strengths, team development, self-awareness'),

((SELECT id FROM prompt_categories WHERE slug = 'team-building'),
'Team Goal Setting Workshop',
'Align teams on shared goals',
'Facilitate a team goal-setting workshop for [number] people. Planning period: [quarter/year]. Include: review of past performance, ideation activities, prioritization exercise, goal documentation, and commitment mechanism. Balance ambition with realism.',
'Goal setting, team alignment, planning'),

((SELECT id FROM prompt_categories WHERE slug = 'team-building'),
'Team Feedback Culture',
'Build a feedback-rich team culture',
'Create a plan to build a feedback culture in [team]. Current state: [describe]. Include: feedback frameworks to teach, practice exercises, integration into regular rhythms, manager modeling, and measurement of progress. Start small and build.',
'Feedback culture, continuous improvement, communication'),

((SELECT id FROM prompt_categories WHERE slug = 'team-building'),
'Remote Team Rituals',
'Create connection rituals for remote teams',
'Design team rituals for a remote team of [number] across [time zones]. Include: daily/weekly connection points, virtual social activities, celebration practices, and communication rhythms. Keep it sustainable and high-value for time invested.',
'Remote work, team rituals, virtual connection'),

((SELECT id FROM prompt_categories WHERE slug = 'team-building'),
'Team Health Check',
'Assess team health and dynamics',
'Create a team health check survey/exercise for [team]. Areas to assess: psychological safety, clarity, engagement, collaboration, and workload. Include: assessment questions, discussion format, and action planning. Keep it safe for honest input.',
'Team health, assessment, team development'),

((SELECT id FROM prompt_categories WHERE slug = 'team-building'),
'Volunteer/Giving Activity',
'Organize team volunteer events',
'Plan a team volunteer/giving activity for [number] people. Duration: [half day/full day/ongoing]. Interests: [describe]. Budget: [amount]. Options: [virtual/in-person]. Recommend: 3 options with logistics, impact description, and team-building benefits.',
'Volunteering, team service, corporate social responsibility'),

((SELECT id FROM prompt_categories WHERE slug = 'team-building'),
'Team Building Game Ideas',
'Curate team building games',
'Recommend 10 team building games/activities for [context: meeting opener/full session/etc.]. Team size: [number]. Format: [virtual/in-person]. Time per activity: [minutes]. For each, provide: instructions, materials needed, energy level, and what it builds.',
'Games, activities, engagement'),

((SELECT id FROM prompt_categories WHERE slug = 'team-building'),
'New Manager Team Integration',
'Help new managers integrate with teams',
'Create a 30-day plan for a new manager joining [team size] team. Context: [internal promotion/external hire]. Include: listening tour structure, one-on-one approach, quick wins to pursue, and pitfalls to avoid. Balance learning with building credibility.',
'New manager, leadership transition, team integration'),

((SELECT id FROM prompt_categories WHERE slug = 'team-building'),
'Team Meeting Refresh',
'Improve regular team meetings',
'Redesign our team meeting for [meeting cadence]. Current problems: [describe issues]. Include: meeting purpose clarity, improved agenda structure, engagement tactics, action tracking, and async alternatives where possible. Make meetings worth attending.',
'Meeting effectiveness, team meetings, productivity');

-- ===========================================
-- PROMPTS - PERSONAL ASSISTANTS (20 prompts)
-- ===========================================
INSERT INTO prompts (category_id, title, description, prompt_text, use_cases) VALUES
((SELECT id FROM prompt_categories WHERE slug = 'personal-assistants'),
'Gift Selection Assistance',
'Choose thoughtful gifts for executives to give',
'Help select a gift for [recipient: client/employee/speaker/etc.]. Budget: [amount]. Occasion: [reason for gift]. Their interests: [if known]. Relationship: [describe]. Recommend 5 gift options with: item, cost, where to purchase, and why it fits. Consider personalization options.',
'Gift selection, client gifts, recognition'),

((SELECT id FROM prompt_categories WHERE slug = 'personal-assistants'),
'Personal Errand Coordination',
'Manage personal errands efficiently',
'Create an errand coordination plan for [list of tasks]. Deadlines: [any time constraints]. Location: [city/area]. Optimize: route planning, task grouping, delegation opportunities, and scheduling. Account for business hours and any access requirements.',
'Errand management, personal tasks, time optimization'),

((SELECT id FROM prompt_categories WHERE slug = 'personal-assistants'),
'Restaurant Reservation Research',
'Research and book dining reservations',
'Research restaurant options for [occasion] in [city/neighborhood] on [date]. Party size: [number]. Preferences: [cuisine, ambiance, dietary needs]. Budget: [per person]. Provide: 5 recommendations with cuisine, price range, availability, and notable features.',
'Restaurant reservations, dining, client entertainment'),

((SELECT id FROM prompt_categories WHERE slug = 'personal-assistants'),
'Family Event Planning',
'Support executives with family events',
'Help plan [family event: birthday/anniversary/graduation] for executive. Event date: [date]. Details: [who it is for, preferences known]. Budget: [amount]. Include: venue options, catering, entertainment, and logistics. Balance personal touch with executive time constraints.',
'Family events, personal planning, work-life support'),

((SELECT id FROM prompt_categories WHERE slug = 'personal-assistants'),
'Home Service Coordination',
'Coordinate home services and maintenance',
'Create a home services schedule for [service types: cleaning/maintenance/landscaping/etc.]. Property: [describe]. Include: recommended frequencies, vendor management, access arrangements, and quality checks. Set up systems that minimize ongoing oversight.',
'Home management, vendor coordination, personal services'),

((SELECT id FROM prompt_categories WHERE slug = 'personal-assistants'),
'Personal Contact Management',
'Organize personal contact information',
'Create a contact management system for personal contacts. Categories needed: [family/friends/service providers/etc.]. Include: information to track for each category, organization method, update reminders, and backup approach. Respect privacy considerations.',
'Contact management, personal organization, CRM'),

((SELECT id FROM prompt_categories WHERE slug = 'personal-assistants'),
'Holiday Card List Management',
'Manage holiday and greeting card lists',
'Create a holiday card management system. Approximate list size: [number]. Include: list organization, address verification process, card selection criteria, mailing timeline, and tracking sent cards. Add personalization notes where relevant.',
'Holiday cards, relationship management, personal correspondence'),

((SELECT id FROM prompt_categories WHERE slug = 'personal-assistants'),
'Personal Calendar Integration',
'Integrate personal and professional calendars',
'Create a system for managing personal appointments alongside professional calendar. Challenges: [describe current pain points]. Include: visibility controls, blocking for personal time, handling conflicts, and family calendar integration. Protect privacy while enabling coordination.',
'Calendar management, work-life balance, time management'),

((SELECT id FROM prompt_categories WHERE slug = 'personal-assistants'),
'Vehicle Management Tracking',
'Track vehicle maintenance and renewals',
'Create a vehicle management tracker for [number of vehicles]. Include: maintenance schedule, registration renewal reminders, insurance tracking, and service provider contacts. Add mileage logging if company car. Set up proactive reminders.',
'Vehicle management, maintenance tracking, personal admin'),

((SELECT id FROM prompt_categories WHERE slug = 'personal-assistants'),
'Subscription Management',
'Track and optimize subscriptions',
'Audit and organize subscriptions for [personal/executive]. Categories: [streaming/publications/memberships/services]. For each, track: cost, renewal date, payment method, usage level. Identify: potential cancellations, consolidation opportunities, and better pricing.',
'Subscription management, expense tracking, optimization'),

((SELECT id FROM prompt_categories WHERE slug = 'personal-assistants'),
'Household Staff Coordination',
'Manage household employees',
'Create a coordination system for household staff: [list roles: housekeeper/nanny/driver/etc.]. Include: schedule management, communication protocols, task delegation, quality standards, and payroll tracking. Maintain appropriate employer-employee boundaries.',
'Household staff, staff management, personal employees'),

((SELECT id FROM prompt_categories WHERE slug = 'personal-assistants'),
'Personal Travel Preferences',
'Document and maintain travel preferences',
'Create a comprehensive personal travel profile for [executive name]. Include: airline preferences, hotel preferences, dietary restrictions, medical needs, emergency contacts, loyalty programs, and travel quirks (window/aisle, early/late flights). Update regularly.',
'Travel preferences, personalization, traveler profile'),

((SELECT id FROM prompt_categories WHERE slug = 'personal-assistants'),
'Medical Appointment Coordination',
'Coordinate medical appointments',
'Create a medical appointment tracking system. Include: physician directory, appointment scheduling, prescription management, insurance information, and medical history access. Set up preventive care reminders. Handle with appropriate confidentiality.',
'Medical coordination, health management, personal care'),

((SELECT id FROM prompt_categories WHERE slug = 'personal-assistants'),
'Pet Care Management',
'Coordinate pet care and services',
'Create a pet care management system for [pet type and name]. Include: veterinary contacts, grooming schedule, boarding/sitting arrangements, feeding/medication schedules, and emergency protocols. Add caregiver instructions for when owner travels.',
'Pet care, animal management, personal services'),

((SELECT id FROM prompt_categories WHERE slug = 'personal-assistants'),
'Personal Shopping Assistance',
'Support personal shopping needs',
'Create a personal shopping guide for [executive]. Shopping needs: [wardrobe/gifts/household]. Preferences: [brands, styles]. Include: preferred retailers, sizing information, shopping calendar, and relationship with personal shoppers/stylists.',
'Personal shopping, wardrobe management, procurement'),

((SELECT id FROM prompt_categories WHERE slug = 'personal-assistants'),
'Charitable Giving Tracker',
'Track charitable contributions',
'Create a charitable giving tracker for [year]. Causes of interest: [describe]. Annual giving goal: [if any]. Include: donation tracking, tax documentation, recurring gifts, event invitations, and impact reports. Organize for tax time and strategic philanthropy.',
'Charitable giving, donations, philanthropy'),

((SELECT id FROM prompt_categories WHERE slug = 'personal-assistants'),
'Meal Planning Support',
'Support personal meal planning',
'Create a meal planning system for [executive/family]. Constraints: [dietary restrictions, preferences]. Frequency: [all meals/dinners only]. Include: meal rotation ideas, grocery list automation, recipe collection, and coordination with household staff if applicable.',
'Meal planning, personal nutrition, household management'),

((SELECT id FROM prompt_categories WHERE slug = 'personal-assistants'),
'Personal Document Organization',
'Organize important personal documents',
'Create a personal document organization system. Document types: [passport/insurance/will/property/etc.]. Include: secure storage method, expiration tracking, access protocols, and emergency accessibility. Balance security with availability.',
'Document management, personal records, organization'),

((SELECT id FROM prompt_categories WHERE slug = 'personal-assistants'),
'Life Admin Calendar',
'Track ongoing personal administration',
'Create a life admin calendar covering annual personal tasks. Include: tax deadlines, insurance renewals, property maintenance, vehicle registrations, subscription renewals, and annual medical appointments. Set up reminders with appropriate lead time.',
'Life admin, personal calendar, reminders'),

((SELECT id FROM prompt_categories WHERE slug = 'personal-assistants'),
'Concierge Request Template',
'Make requests to concierge services',
'Create templates for common concierge requests: [restaurant reservations, tickets, travel arrangements, etc.]. Include: information to provide, preferences to note, timeline expectations, and follow-up protocol. Make requests clear and complete.',
'Concierge services, requests, luxury services');

-- ===========================================
-- PROMPTS - REMOTE WORK (20 prompts)
-- ===========================================
INSERT INTO prompts (category_id, title, description, prompt_text, use_cases) VALUES
((SELECT id FROM prompt_categories WHERE slug = 'remote-work'),
'Remote Work Policy Template',
'Create comprehensive remote work policies',
'Create a remote work policy for [company type/size]. Current arrangement: [describe]. Address: eligibility, equipment/expenses, work hours, communication expectations, performance management, and security requirements. Balance flexibility with business needs.',
'Remote work policy, HR, workplace flexibility'),

((SELECT id FROM prompt_categories WHERE slug = 'remote-work'),
'Virtual Meeting Best Practices',
'Establish virtual meeting standards',
'Create virtual meeting best practices for [team/company]. Common meeting types: [list]. Address: camera usage, background standards, audio etiquette, engagement techniques, and technical troubleshooting. Keep it practical and enforceable.',
'Virtual meetings, video conferencing, remote etiquette'),

((SELECT id FROM prompt_categories WHERE slug = 'remote-work'),
'Home Office Setup Guide',
'Guide employees on home office setup',
'Create a home office setup guide for [role type]. Budget: [company contribution if any]. Cover: ergonomics, technology requirements, lighting, noise management, and productivity environment. Include both requirements and recommendations.',
'Home office, equipment, work environment'),

((SELECT id FROM prompt_categories WHERE slug = 'remote-work'),
'Async Communication Guide',
'Master asynchronous communication',
'Create an asynchronous communication guide for remote teams. Tools used: [list platforms]. Cover: when to use async vs. sync, writing effective async messages, response time norms, documentation practices, and timezone courtesy.',
'Async communication, remote collaboration, productivity'),

((SELECT id FROM prompt_categories WHERE slug = 'remote-work'),
'Remote Onboarding Checklist',
'Onboard remote employees effectively',
'Create a remote onboarding checklist for [role]. Duration: [first week/month/90 days]. Include: equipment shipping, system access, virtual introductions, training schedule, buddy program, and check-in cadence. Make new hires feel connected despite distance.',
'Remote onboarding, new hire, employee experience'),

((SELECT id FROM prompt_categories WHERE slug = 'remote-work'),
'Time Zone Coordination',
'Manage teams across time zones',
'Create a time zone coordination guide for a team spanning [list time zones]. Include: overlap hour identification, meeting rotation fairness, async handoff protocols, and timezone-aware scheduling tools. Respect work-life balance across all zones.',
'Time zones, global teams, coordination'),

((SELECT id FROM prompt_categories WHERE slug = 'remote-work'),
'Remote Team Culture Building',
'Build culture in remote teams',
'Create a culture-building plan for a remote team of [number]. Current challenges: [describe]. Include: virtual social activities, recognition practices, communication rhythms, and traditions that work remotely. Make it sustainable, not forced.',
'Remote culture, team building, employee engagement'),

((SELECT id FROM prompt_categories WHERE slug = 'remote-work'),
'Remote Performance Management',
'Manage remote employee performance',
'Create a remote performance management framework. Team size: [number]. Include: goal-setting approach, check-in frequency, documentation methods, feedback mechanisms, and fair evaluation practices. Focus on outcomes, not presence.',
'Performance management, remote supervision, evaluation'),

((SELECT id FROM prompt_categories WHERE slug = 'remote-work'),
'Virtual Collaboration Tools Guide',
'Optimize remote collaboration tools',
'Create a guide for using our collaboration tools effectively: [list tools]. Cover: primary use case for each, integration between tools, power user tips, common mistakes, and governance. Reduce tool confusion and friction.',
'Collaboration tools, productivity software, remote work'),

((SELECT id FROM prompt_categories WHERE slug = 'remote-work'),
'Remote Work Schedule Template',
'Structure effective remote schedules',
'Create a remote work schedule template for [role type]. Include: core collaboration hours, focus time blocks, meeting days/times, personal time buffers, and visible/away status guidance. Balance availability with productivity.',
'Scheduling, work structure, time management'),

((SELECT id FROM prompt_categories WHERE slug = 'remote-work'),
'Hybrid Meeting Facilitation',
'Run effective hybrid meetings',
'Create a hybrid meeting facilitation guide for meetings with both in-room and remote participants. Room setup: [describe]. Address: technology setup, engagement equity, facilitation techniques, and common pitfalls. Make remote participants feel equally included.',
'Hybrid meetings, facilitation, inclusion'),

((SELECT id FROM prompt_categories WHERE slug = 'remote-work'),
'Remote Work Security Checklist',
'Secure remote work environments',
'Create a security checklist for remote workers. IT environment: [describe]. Cover: network security, device protection, data handling, physical security, and incident reporting. Make it practical for non-technical employees.',
'Security, data protection, remote compliance'),

((SELECT id FROM prompt_categories WHERE slug = 'remote-work'),
'Virtual Event Planning',
'Plan engaging virtual events',
'Plan a virtual [event type: happy hour/celebration/learning session] for [number] remote participants. Duration: [time]. Include: platform selection, engagement activities, technical rehearsal, and backup plans. Make it worth attending.',
'Virtual events, remote engagement, team events'),

((SELECT id FROM prompt_categories WHERE slug = 'remote-work'),
'Remote Communication Cadence',
'Establish communication rhythms',
'Design a communication cadence for a remote team of [number]. Include: daily standups (if any), weekly team meetings, one-on-ones, all-hands, and informal touchpoints. Balance staying connected with avoiding meeting fatigue.',
'Communication, meeting cadence, remote rhythms'),

((SELECT id FROM prompt_categories WHERE slug = 'remote-work'),
'Working From Anywhere Guide',
'Support work from non-home locations',
'Create a guide for working from non-home locations (travel, coworking, etc.). Cover: connectivity requirements, security considerations, client confidentiality, time zone communication, and productivity tips. Enable flexibility responsibly.',
'Digital nomad, travel work, flexible work'),

((SELECT id FROM prompt_categories WHERE slug = 'remote-work'),
'Remote Wellness Program',
'Support remote employee wellness',
'Design a wellness program for remote employees. Team size: [number]. Address: ergonomic support, mental health resources, physical activity encouragement, and social connection. Budget: [amount]. Make participation easy and judgment-free.',
'Employee wellness, remote health, work-life balance'),

((SELECT id FROM prompt_categories WHERE slug = 'remote-work'),
'Virtual Presence Optimization',
'Improve virtual presence and presentation',
'Create a guide for optimizing virtual presence. Cover: camera angle and lighting, background and environment, audio quality, on-camera energy, and wardrobe considerations. Help people look and sound their best on video.',
'Video presence, professional image, virtual communication'),

((SELECT id FROM prompt_categories WHERE slug = 'remote-work'),
'Remote Work Boundary Setting',
'Set healthy remote work boundaries',
'Create a boundary-setting guide for remote workers. Common challenges: [overwork/distraction/availability expectations]. Include: physical boundaries, time boundaries, communication boundaries, and how to communicate them professionally.',
'Boundaries, work-life balance, remote wellness'),

((SELECT id FROM prompt_categories WHERE slug = 'remote-work'),
'Documentation Standards Remote',
'Document work for remote teams',
'Create documentation standards for remote team work. Tools available: [list]. Cover: what to document, where to store, naming conventions, update responsibilities, and search/findability. Reduce knowledge silos and tribal knowledge.',
'Documentation, knowledge management, remote collaboration'),

((SELECT id FROM prompt_categories WHERE slug = 'remote-work'),
'Remote Team Assessment',
'Assess remote work effectiveness',
'Create an assessment tool for evaluating remote work effectiveness. Areas to measure: productivity, communication, collaboration, engagement, and wellbeing. Include: survey questions, discussion prompts, and action planning template.',
'Assessment, remote effectiveness, continuous improvement');

-- ===========================================
-- PROMPTS - TEMPLATES (20 prompts)
-- ===========================================
INSERT INTO prompts (category_id, title, description, prompt_text, use_cases) VALUES
((SELECT id FROM prompt_categories WHERE slug = 'templates'),
'Meeting Agenda Template',
'Create reusable meeting agenda templates',
'Create a meeting agenda template for [meeting type: team meeting/one-on-one/project kickoff/etc.]. Include: header with meeting details, timed agenda sections, decision points, action items, and notes area. Design for easy customization and consistent use.',
'Meeting agendas, templates, productivity'),

((SELECT id FROM prompt_categories WHERE slug = 'templates'),
'Project Brief Template',
'Standardize project initiation',
'Create a project brief template for [project type]. Include: project overview, objectives, scope, stakeholders, timeline, budget, success criteria, and risks. Make it comprehensive enough for approval but not overly burdensome.',
'Project briefs, initiation, project management'),

((SELECT id FROM prompt_categories WHERE slug = 'templates'),
'Standard Operating Procedure Template',
'Create SOP templates',
'Create an SOP template for [process type]. Include: purpose, scope, roles and responsibilities, step-by-step procedure, required tools/resources, and review schedule. Format for easy training and reference use.',
'SOPs, procedures, documentation'),

((SELECT id FROM prompt_categories WHERE slug = 'templates'),
'Email Response Templates',
'Create common email response templates',
'Create email response templates for common scenarios: [list: meeting requests, information requests, thank yous, etc.]. For each, provide: template with placeholders, when to use, and personalization tips. Save time while maintaining personal touch.',
'Email templates, correspondence, productivity'),

((SELECT id FROM prompt_categories WHERE slug = 'templates'),
'One-Page Report Template',
'Create concise one-page reports',
'Create a one-page report template for [purpose: status update/proposal/summary]. Include: header section, key metrics/highlights, main content, and action/decision section. Optimize for executive scanning and decision-making.',
'One-pagers, executive summaries, reporting'),

((SELECT id FROM prompt_categories WHERE slug = 'templates'),
'Decision Document Template',
'Document decisions consistently',
'Create a decision document template for [decision type: vendor selection/policy change/project approval]. Include: decision statement, context, options considered, recommendation, risks, and approval signatures. Provide clear decision trail.',
'Decision documents, governance, documentation'),

((SELECT id FROM prompt_categories WHERE slug = 'templates'),
'Vendor Evaluation Template',
'Evaluate vendors consistently',
'Create a vendor evaluation template for [vendor type]. Include: evaluation criteria with weights, scoring methodology, comparison matrix, reference check questions, and recommendation section. Enable objective vendor comparison.',
'Vendor evaluation, procurement, decision making'),

((SELECT id FROM prompt_categories WHERE slug = 'templates'),
'Communication Plan Template',
'Plan project communications',
'Create a communication plan template for [project/initiative]. Include: stakeholder analysis, message mapping, channel selection, timing, feedback loops, and responsible parties. Ensure nothing falls through cracks.',
'Communication planning, stakeholder management, projects'),

((SELECT id FROM prompt_categories WHERE slug = 'templates'),
'Weekly Report Template',
'Standardize weekly reporting',
'Create a weekly report template for [role/team]. Include: accomplishments, in-progress items, upcoming priorities, blockers, and metrics. Design for 10-minute creation and 2-minute reading. Balance completeness with conciseness.',
'Weekly reports, status updates, accountability'),

((SELECT id FROM prompt_categories WHERE slug = 'templates'),
'Checklist Template Creator',
'Create effective checklists',
'Create a checklist template for [process: event planning/onboarding/travel prep/etc.]. Include: categorized items, completion tracking, responsible parties, timing, and notes field. Design for reuse with minimal customization.',
'Checklists, quality assurance, process management'),

((SELECT id FROM prompt_categories WHERE slug = 'templates'),
'Business Case Template',
'Build compelling business cases',
'Create a business case template for [initiative type]. Include: executive summary, problem statement, proposed solution, costs, benefits (quantified), risks, alternatives, and recommendation. Designed for leadership approval decisions.',
'Business cases, proposals, investment decisions'),

((SELECT id FROM prompt_categories WHERE slug = 'templates'),
'RACI Matrix Template',
'Define roles and responsibilities',
'Create a RACI matrix template for [project/process]. Include: task inventory rows, role columns, RACI assignment grid, and usage guidelines. Add instructions for completing and using effectively.',
'RACI, roles, responsibilities, governance'),

((SELECT id FROM prompt_categories WHERE slug = 'templates'),
'Post-Mortem Template',
'Document lessons learned',
'Create a post-mortem template for [project/incident]. Include: objective summary, timeline, what went well, what could improve, root causes, action items, and prevention measures. Keep it blameless and action-oriented.',
'Post-mortems, retrospectives, lessons learned'),

((SELECT id FROM prompt_categories WHERE slug = 'templates'),
'Job Description Template',
'Create consistent job descriptions',
'Create a job description template for [role type]. Include: role summary, responsibilities, requirements (must-have vs. nice-to-have), success measures, and company/team info. Balance attractiveness with accuracy.',
'Job descriptions, recruiting, HR'),

((SELECT id FROM prompt_categories WHERE slug = 'templates'),
'Invoice Template',
'Create professional invoices',
'Create an invoice template for [service type]. Include: sender/receiver info, itemized services, pricing, payment terms, and payment instructions. Ensure professional appearance and clear expectations.',
'Invoicing, billing, financial documents'),

((SELECT id FROM prompt_categories WHERE slug = 'templates'),
'Contract Summary Template',
'Summarize contracts for executives',
'Create a contract summary template for [contract type]. Include: parties, key terms, obligations, timeline, costs, termination provisions, and risks. Enable quick executive review of complex documents.',
'Contract summaries, legal review, executive briefings'),

((SELECT id FROM prompt_categories WHERE slug = 'templates'),
'Knowledge Base Article Template',
'Create consistent knowledge base content',
'Create a knowledge base article template for [content type: how-to/FAQ/policy]. Include: title format, description, step-by-step content, related articles, and metadata. Optimize for searchability and self-service.',
'Knowledge base, documentation, self-service'),

((SELECT id FROM prompt_categories WHERE slug = 'templates'),
'Training Materials Template',
'Create training content consistently',
'Create a training materials template for [training type]. Include: learning objectives, agenda, content sections, exercises, and assessment. Design for instructor-led or self-paced use.',
'Training materials, L&D, instruction'),

((SELECT id FROM prompt_categories WHERE slug = 'templates'),
'Survey Template',
'Design effective surveys',
'Create a survey template for [purpose: feedback/engagement/research]. Include: intro/consent, question types (rating, multiple choice, open-ended), logical flow, and closing. Balance comprehensiveness with completion rate.',
'Surveys, feedback, research'),

((SELECT id FROM prompt_categories WHERE slug = 'templates'),
'Handoff Document Template',
'Create smooth transition documents',
'Create a handoff document template for [situation: role transition/project transfer/vacation coverage]. Include: current status, ongoing items, contacts, pending decisions, and known issues. Enable smooth continuity.',
'Handoffs, transitions, continuity');

-- ===========================================
-- PROMPTS - AUTOMATION (20 prompts)
-- ===========================================
INSERT INTO prompts (category_id, title, description, prompt_text, use_cases) VALUES
((SELECT id FROM prompt_categories WHERE slug = 'automation'),
'Email Filter Setup',
'Organize inbox with smart filters',
'Create email filter rules to organize my inbox. Current challenges: [describe email chaos]. Categories to sort: [list]. Tools available: [Gmail/Outlook/etc.]. Provide: filter logic, folder/label structure, and priority handling. Aim to reduce daily email processing time.',
'Email management, inbox organization, productivity'),

((SELECT id FROM prompt_categories WHERE slug = 'automation'),
'Calendar Automation Rules',
'Automate calendar management',
'Create calendar automation rules for [calendar system]. Goals: [block focus time/automate scheduling/etc.]. Current pain points: [describe]. Provide: automation rules, integration suggestions, and manual overrides to maintain.',
'Calendar automation, scheduling, time management'),

((SELECT id FROM prompt_categories WHERE slug = 'automation'),
'Workflow Automation Design',
'Design automated workflows',
'Design an automation workflow for [process]. Current manual steps: [describe]. Tools available: [Zapier/Power Automate/etc.]. Create: trigger event, automated actions, conditional logic, and error handling. Estimate time savings.',
'Workflow automation, process improvement, Zapier'),

((SELECT id FROM prompt_categories WHERE slug = 'automation'),
'Report Generation Automation',
'Automate recurring reports',
'Create a plan to automate [report name]. Current process: [describe]. Data sources: [list]. Frequency: [how often]. Include: data extraction automation, formatting template, distribution list, and quality checks to maintain.',
'Report automation, data processing, efficiency'),

((SELECT id FROM prompt_categories WHERE slug = 'automation'),
'Notification Automation',
'Set up smart notifications',
'Design a notification automation system for [purpose: deadline reminders/status updates/etc.]. Recipients: [describe]. Triggers: [what should cause notifications]. Include: notification content, timing, channels, and escalation rules.',
'Notifications, reminders, alerting'),

((SELECT id FROM prompt_categories WHERE slug = 'automation'),
'Document Generation Automation',
'Automate document creation',
'Create an automation plan for generating [document type]. Template: [describe]. Variable data: [what changes]. Output format: [PDF/Word/etc.]. Include: merge process, review workflow, and storage/naming automation.',
'Document automation, templates, merge'),

((SELECT id FROM prompt_categories WHERE slug = 'automation'),
'Data Entry Automation',
'Reduce manual data entry',
'Identify automation opportunities for data entry in [system/process]. Current data sources: [list]. Current manual entry: [describe]. Recommend: integration options, import automation, and validation rules. Prioritize by time savings.',
'Data entry, integration, efficiency'),

((SELECT id FROM prompt_categories WHERE slug = 'automation'),
'Approval Workflow Automation',
'Streamline approval processes',
'Design an automated approval workflow for [approval type]. Current process: [describe manual steps]. Approvers: [by level/amount/type]. Include: request submission, routing logic, reminder automation, and exception handling.',
'Approval automation, workflow, governance'),

((SELECT id FROM prompt_categories WHERE slug = 'automation'),
'Task Assignment Automation',
'Automate task routing',
'Create task assignment automation for [task type]. Assignment criteria: [by role/workload/skill/rotation]. System: [project management tool]. Include: trigger conditions, assignment rules, notification to assignee, and rebalancing logic.',
'Task automation, workload management, assignment'),

((SELECT id FROM prompt_categories WHERE slug = 'automation'),
'Meeting Scheduling Automation',
'Streamline meeting scheduling',
'Create meeting scheduling automation using [tool: Calendly/Doodle/etc.]. Meeting types: [list]. Include: availability rules, buffer time, meeting types with durations, intake questions, and calendar integration. Reduce scheduling ping-pong.',
'Meeting scheduling, Calendly, time savings'),

((SELECT id FROM prompt_categories WHERE slug = 'automation'),
'Follow-Up Reminder System',
'Automate follow-up reminders',
'Create an automated follow-up reminder system for [context: pending responses/action items/etc.]. Tracking method: [email/task list/CRM]. Include: reminder timing, escalation, and snooze options. Ensure nothing falls through cracks.',
'Follow-up, reminders, accountability'),

((SELECT id FROM prompt_categories WHERE slug = 'automation'),
'Expense Processing Automation',
'Streamline expense processing',
'Create automation for expense processing workflow. Current system: [describe]. Pain points: [list]. Include: receipt capture automation, coding suggestions, approval routing, and reporting automation.',
'Expense automation, finance, processing'),

((SELECT id FROM prompt_categories WHERE slug = 'automation'),
'Social Media Scheduling',
'Automate social media posting',
'Create a social media scheduling automation for [platforms]. Content types: [describe]. Posting frequency: [schedule]. Include: scheduling tool recommendation, content calendar, queue management, and performance tracking automation.',
'Social media, scheduling, content management'),

((SELECT id FROM prompt_categories WHERE slug = 'automation'),
'File Organization Automation',
'Automate file management',
'Create file organization automation for [storage system: Google Drive/SharePoint/etc.]. File types: [describe]. Include: naming conventions, auto-sorting rules, archiving automation, and cleanup routines. Reduce file chaos.',
'File management, organization, automation'),

((SELECT id FROM prompt_categories WHERE slug = 'automation'),
'Contact Sync Automation',
'Keep contacts synchronized',
'Design contact synchronization automation between [systems: CRM, phone, email, etc.]. Sync direction: [one-way/two-way]. Include: field mapping, duplicate handling, update triggers, and conflict resolution.',
'Contact sync, CRM, data management'),

((SELECT id FROM prompt_categories WHERE slug = 'automation'),
'Status Update Automation',
'Automate status reporting',
'Create automated status updates for [project/team]. Data sources: [where status lives]. Recipients: [who needs updates]. Include: data aggregation, formatting, distribution automation, and exception alerts.',
'Status updates, reporting, communication'),

((SELECT id FROM prompt_categories WHERE slug = 'automation'),
'Onboarding Automation',
'Automate onboarding tasks',
'Design onboarding automation for new [employees/clients/members]. Current manual tasks: [list]. Include: triggered task creation, assignment, reminder sequences, and completion tracking.',
'Onboarding automation, HR, workflow'),

((SELECT id FROM prompt_categories WHERE slug = 'automation'),
'Invoice Processing Automation',
'Streamline invoice handling',
'Create invoice processing automation. Current volume: [number/month]. Current process: [describe]. Include: receipt/capture, data extraction, coding automation, approval routing, and payment scheduling.',
'Invoice automation, AP, finance'),

((SELECT id FROM prompt_categories WHERE slug = 'automation'),
'Text Expansion Setup',
'Set up text shortcuts',
'Create a text expansion library for [role/common tasks]. Include: email greetings and signatures, common phrases, code snippets, and templates. Tool recommendation: [TextExpander/other]. Organize by category for easy recall.',
'Text expansion, productivity, efficiency'),

((SELECT id FROM prompt_categories WHERE slug = 'automation'),
'Automation Audit',
'Identify automation opportunities',
'Conduct an automation audit of [my role/this team]. Document: repetitive tasks, time spent on each, automation potential, tool requirements, and implementation priority. Create an automation roadmap based on findings.',
'Automation planning, efficiency, process improvement');

-- ===========================================
-- PROMPTS - EMAIL (20 prompts)
-- ===========================================
INSERT INTO prompts (category_id, title, description, prompt_text, use_cases) VALUES
((SELECT id FROM prompt_categories WHERE slug = 'email'),
'Email Inbox Zero Strategy',
'Achieve and maintain inbox zero',
'Create an inbox zero strategy for my [Gmail/Outlook] inbox. Current inbox size: [number] emails. Daily volume: [estimate]. Include: processing system, folder/label structure, time blocking for email, and habits to maintain. Be realistic for my workload.',
'Inbox zero, email management, productivity'),

((SELECT id FROM prompt_categories WHERE slug = 'email'),
'Email Subject Line Optimizer',
'Write effective email subject lines',
'Rewrite these email subject lines to be more effective: [list subject lines]. Goals: [open rate/action/clarity]. Provide: improved versions with reasoning for each change. Consider length, action words, and specificity.',
'Subject lines, email effectiveness, communication'),

((SELECT id FROM prompt_categories WHERE slug = 'email'),
'Email Response Prioritization',
'Prioritize email responses',
'Help me prioritize these emails for response: [list senders and brief topics]. My role: [title]. Current projects: [list]. Suggest: response order, which can wait, which need immediate attention, and which can be delegated.',
'Email prioritization, time management, triage'),

((SELECT id FROM prompt_categories WHERE slug = 'email'),
'Complex Email Simplification',
'Simplify complicated emails',
'Simplify this email for better clarity: [paste email]. Issues: [too long/unclear ask/buried lead]. Rewrite to be: concise, clear about the ask, and easy to respond to. Maintain professional tone and key information.',
'Email writing, clarity, communication'),

((SELECT id FROM prompt_categories WHERE slug = 'email'),
'Email Thread Summary',
'Summarize long email threads',
'Summarize this email thread: [paste or describe]. Key questions: Who is asking what? What decisions were made? What is pending? Provide: brief summary, action items, and recommended response if one is needed.',
'Email summary, thread management, communication'),

((SELECT id FROM prompt_categories WHERE slug = 'email'),
'Difficult Email Response',
'Respond to challenging emails',
'Help me respond to this difficult email: [paste or describe]. Challenge: [anger/unreasonable request/complaint/etc.]. Goals: [maintain relationship/set boundary/resolve issue]. Draft a professional response that addresses the situation constructively.',
'Difficult emails, professional communication, conflict'),

((SELECT id FROM prompt_categories WHERE slug = 'email'),
'Email Delegation Draft',
'Delegate tasks via email effectively',
'Draft an email delegating [task] to [recipient]. Context they need: [describe]. Deadline: [date]. Include: clear task description, expected outcome, resources available, and check-in point. Make it empowering, not dumping.',
'Delegation, task assignment, management'),

((SELECT id FROM prompt_categories WHERE slug = 'email'),
'Broadcast Email Draft',
'Write effective mass emails',
'Draft a broadcast email to [audience] about [topic]. Size: [number of recipients]. Purpose: [inform/action required/FYI]. Include: clear subject line, scannable format, specific call to action, and appropriate tone for audience.',
'Broadcast emails, announcements, internal comms'),

((SELECT id FROM prompt_categories WHERE slug = 'email'),
'Email Signature Optimization',
'Create professional email signatures',
'Create an email signature for [my role]. Include: name, title, company, contact info. Consider: branding, legal requirements, mobile display, and optional elements (social, booking link, pronouns). Keep it professional and not cluttered.',
'Email signatures, branding, professional image'),

((SELECT id FROM prompt_categories WHERE slug = 'email'),
'Email Unsubscribe Strategy',
'Clean up email subscriptions',
'Create a strategy to reduce unwanted emails. Current estimate: [percentage of inbox that is noise]. Include: unsubscribe approach, filter rules for remaining subscriptions, and prevention of new subscription creep. Make it sustainable.',
'Email management, unsubscribe, productivity'),

((SELECT id FROM prompt_categories WHERE slug = 'email'),
'Email Tone Check',
'Ensure appropriate email tone',
'Review this email for tone: [paste email]. Intended tone: [professional/friendly/urgent/etc.]. Identify: any language that might be misread, areas that seem too harsh or too soft, and suggestions for improvement. Preserve my message.',
'Email tone, professional communication, review'),

((SELECT id FROM prompt_categories WHERE slug = 'email'),
'Cold Email Template',
'Write effective cold outreach',
'Create a cold email template for [purpose: networking/sales/partnership]. Target recipient type: [describe]. Include: compelling hook, value proposition, specific ask, and easy opt-out. Keep it brief and respectful of their time.',
'Cold emails, outreach, networking'),

((SELECT id FROM prompt_categories WHERE slug = 'email'),
'Email Reminder Sequence',
'Create reminder email sequences',
'Create a reminder sequence for [purpose: unpaid invoice/unsigned document/pending response]. Timing: [frequency]. Draft 3-4 emails progressing from gentle reminder to firmer follow-up. Maintain professionalism throughout escalation.',
'Reminder emails, follow-up, collections'),

((SELECT id FROM prompt_categories WHERE slug = 'email'),
'Email Introduction Format',
'Introduce yourself via email',
'Draft a self-introduction email to [recipient and context]. Purpose: [new colleague/new client/networking]. Include: who I am, why I am reaching out, what I offer/need, and suggested next step. Make it memorable but not presumptuous.',
'Introductions, networking, first impressions'),

((SELECT id FROM prompt_categories WHERE slug = 'email'),
'Email CC/BCC Strategy',
'Use CC and BCC appropriately',
'Create guidelines for when to use CC and BCC in our organization. Scenarios to address: keeping people informed, covering yourself, executive visibility, and avoiding reply-all issues. Include examples and anti-patterns.',
'Email etiquette, CC/BCC, professional standards'),

((SELECT id FROM prompt_categories WHERE slug = 'email'),
'Email Response Time Standards',
'Set email response expectations',
'Create email response time guidelines for [team/organization]. Consider: internal vs. external, urgency levels, and after-hours. Include: reasonable expectations, how to signal urgency, and out-of-office protocols.',
'Response time, email expectations, communication norms'),

((SELECT id FROM prompt_categories WHERE slug = 'email'),
'Email Newsletter Review',
'Improve email newsletter content',
'Review this email newsletter draft: [paste content]. Purpose: [inform/engage/drive action]. Suggest: subject line improvements, content reorganization, formatting for skimming, and call to action enhancement.',
'Newsletters, email marketing, content improvement'),

((SELECT id FROM prompt_categories WHERE slug = 'email'),
'Email Escalation Draft',
'Escalate issues professionally via email',
'Draft an escalation email about [issue] to [higher level]. Previous attempts to resolve: [describe]. Include: clear issue statement, impact, what you need, and timeline. Be factual, not emotional. Attach relevant documentation references.',
'Escalation, issue resolution, stakeholder management'),

((SELECT id FROM prompt_categories WHERE slug = 'email'),
'Email Archive Strategy',
'Manage email archives',
'Create an email archive strategy for [compliance/organization needs]. Retention requirements: [if any]. Include: what to archive vs. delete, folder structure, search optimization, and regular maintenance routine.',
'Email archiving, record keeping, organization'),

((SELECT id FROM prompt_categories WHERE slug = 'email'),
'Email Template Library',
'Build a personal email template library',
'Create an email template library for my role as [title]. Common email types: [list]. For each, create: template with placeholders, when to use, and personalization reminders. Organize for quick access.',
'Email templates, productivity, standardization');

-- ===========================================
-- PROMPTS - MARKETING (20 prompts)
-- ===========================================
INSERT INTO prompts (category_id, title, description, prompt_text, use_cases) VALUES
((SELECT id FROM prompt_categories WHERE slug = 'marketing'),
'Event Promotion Plan',
'Promote events effectively',
'Create a promotion plan for [event name] on [date]. Target audience: [describe]. Channels available: [list]. Include: timeline, messaging for each channel, visual needs, and call to action. Goal is [number] attendees.',
'Event marketing, promotion, communications'),

((SELECT id FROM prompt_categories WHERE slug = 'marketing'),
'Internal Newsletter Content',
'Create engaging internal newsletters',
'Create content for an internal newsletter. Frequency: [weekly/monthly]. Topics to cover: [company news/wins/updates]. Include: engaging headlines, brief content blocks, and employee spotlight ideas. Keep it readable in under 5 minutes.',
'Internal communications, newsletters, employee engagement'),

((SELECT id FROM prompt_categories WHERE slug = 'marketing'),
'Social Media Post Ideas',
'Generate social media content ideas',
'Generate 20 social media post ideas for [company/department]. Platforms: [list]. Topics to cover: [industry/culture/product]. Include: mix of formats (text, image suggestions, polls, etc.). Align with [brand voice/values].',
'Social media, content ideas, marketing'),

((SELECT id FROM prompt_categories WHERE slug = 'marketing'),
'Company Announcement Draft',
'Draft company announcements',
'Draft a company announcement about [news: new hire/product/partnership/milestone]. Audience: [internal/external/both]. Include: headline, key message, quote from leadership, and supporting details. Tone should match [company voice].',
'Announcements, PR, corporate communications'),

((SELECT id FROM prompt_categories WHERE slug = 'marketing'),
'Employee Advocacy Content',
'Create shareable employee content',
'Create employee-shareable content about [topic/announcement]. Platform: [LinkedIn/Twitter]. Include: suggested post copy, key talking points, and do/don''t guidance for employees. Make it feel authentic, not corporate.',
'Employee advocacy, social media, brand amplification'),

((SELECT id FROM prompt_categories WHERE slug = 'marketing'),
'Event Recap Content',
'Create post-event marketing content',
'Create post-event content for [event name]. Event highlights: [describe]. Content needed: [email recap/social posts/blog post]. Include: key takeaways, quotes, photo captions, and future event tease.',
'Event recaps, content creation, follow-up'),

((SELECT id FROM prompt_categories WHERE slug = 'marketing'),
'Recruitment Marketing',
'Market job opportunities',
'Create recruitment marketing content for [position]. Unique selling points of the role: [list]. Company culture highlights: [describe]. Include: job posting copy, social media posts, and employee testimonial prompts.',
'Recruitment marketing, employer brand, hiring'),

((SELECT id FROM prompt_categories WHERE slug = 'marketing'),
'Client Case Study Outline',
'Structure client success stories',
'Create a case study outline for [client] success story. Challenge they faced: [describe]. Solution provided: [describe]. Results: [metrics]. Include: interview questions for client, story structure, and approval process.',
'Case studies, client marketing, success stories'),

((SELECT id FROM prompt_categories WHERE slug = 'marketing'),
'Email Campaign Planning',
'Plan email marketing campaigns',
'Plan an email campaign for [purpose: product launch/event/nurture]. Target audience: [describe]. Number of emails: [suggest]. Include: email cadence, subject line ideas, and key content for each email. Goal: [desired outcome].',
'Email marketing, campaigns, nurture'),

((SELECT id FROM prompt_categories WHERE slug = 'marketing'),
'Brand Voice Guidelines',
'Define or refine brand voice',
'Create brand voice guidelines for [company/department]. Current perception: [describe]. Desired perception: [describe]. Include: voice characteristics, do/don''t examples, and sample copy in brand voice. Make it practical for writers.',
'Brand voice, style guide, communications'),

((SELECT id FROM prompt_categories WHERE slug = 'marketing'),
'Webinar Promotion',
'Promote webinars effectively',
'Create a promotion plan for [webinar title] on [date]. Speaker: [name and credentials]. Target audience: [describe]. Include: landing page copy, email sequence, social posts, and partner promotion asks. Registration goal: [number].',
'Webinar marketing, promotion, lead generation'),

((SELECT id FROM prompt_categories WHERE slug = 'marketing'),
'Award Submission Draft',
'Write award nominations',
'Draft an award submission for [award name]. Category: [specific category]. Subject: [person/project/company]. Include: compelling narrative, quantified achievements, and supporting evidence. Follow [word count/format requirements if known].',
'Awards, recognition, PR'),

((SELECT id FROM prompt_categories WHERE slug = 'marketing'),
'Press Release Draft',
'Write press releases',
'Draft a press release announcing [news]. Company: [name]. Include: headline, dateline, lead paragraph, body with quotes, boilerplate, and contact info. Follow AP style. Newsworthy angle: [what makes this notable].',
'Press releases, PR, media relations'),

((SELECT id FROM prompt_categories WHERE slug = 'marketing'),
'Content Calendar Planning',
'Plan content calendars',
'Create a [monthly/quarterly] content calendar for [channels]. Themes to cover: [list]. Include: content mix, posting frequency, key dates to leverage, and content ideas for each slot. Leave room for timely content.',
'Content calendar, planning, marketing operations'),

((SELECT id FROM prompt_categories WHERE slug = 'marketing'),
'Customer Testimonial Request',
'Request customer testimonials',
'Draft a testimonial request to [customer]. What we want them to speak to: [topic]. Format: [written/video/quote]. Include: the ask email, guiding questions, and easy submission process. Make it low-effort for them.',
'Testimonials, social proof, customer marketing'),

((SELECT id FROM prompt_categories WHERE slug = 'marketing'),
'Partnership Announcement',
'Announce partnerships effectively',
'Draft partner announcement content for [partnership with Company X]. Partnership scope: [describe]. Include: joint press release outline, social posts for both parties, and email announcement. Coordinate messaging.',
'Partnership marketing, co-marketing, announcements'),

((SELECT id FROM prompt_categories WHERE slug = 'marketing'),
'Trade Show Marketing',
'Market trade show presence',
'Create marketing materials for [trade show] presence. Booth: [size/location]. Goals: [leads/meetings/awareness]. Include: pre-show outreach, booth messaging, giveaway ideas, and post-show follow-up plan.',
'Trade shows, event marketing, lead generation'),

((SELECT id FROM prompt_categories WHERE slug = 'marketing'),
'Product Feature Announcement',
'Announce product updates',
'Draft announcement content for [new feature/product update]. Target audience: [who this helps]. Key benefit: [main value]. Include: email to users, in-app messaging, social posts, and blog post outline.',
'Product marketing, feature announcements, updates'),

((SELECT id FROM prompt_categories WHERE slug = 'marketing'),
'Competitive Positioning',
'Position against competitors',
'Create competitive positioning content for [our product] vs. [competitor]. Key differentiators: [list]. Target buyer: [describe]. Include: comparison talking points, battle card content, and objection responses. Stay factual and professional.',
'Competitive marketing, positioning, sales enablement'),

((SELECT id FROM prompt_categories WHERE slug = 'marketing'),
'Holiday Marketing Campaign',
'Plan holiday marketing',
'Plan a [holiday/occasion] marketing campaign. Timeframe: [dates]. Products/offers to promote: [describe]. Channels: [list]. Include: campaign theme, content calendar, promotional offers, and performance goals.',
'Holiday marketing, seasonal campaigns, promotions');

-- ===========================================
-- PROMPTS - CONTENT CREATION (20 prompts)
-- ===========================================
INSERT INTO prompts (category_id, title, description, prompt_text, use_cases) VALUES
((SELECT id FROM prompt_categories WHERE slug = 'content-creation'),
'Blog Post Outline',
'Structure effective blog posts',
'Create an outline for a blog post about [topic]. Target audience: [describe]. Goal: [inform/persuade/guide]. SEO keywords to include: [list if any]. Include: headline options, section structure, key points per section, and call to action.',
'Blog writing, content marketing, SEO'),

((SELECT id FROM prompt_categories WHERE slug = 'content-creation'),
'LinkedIn Article Draft',
'Write LinkedIn thought leadership',
'Draft a LinkedIn article about [topic]. Author: [name and role]. Key perspective: [unique angle]. Length: [words]. Include: compelling hook, personal insight/experience, and discussion prompt. Make it authentic, not promotional.',
'LinkedIn, thought leadership, personal branding'),

((SELECT id FROM prompt_categories WHERE slug = 'content-creation'),
'Video Script Writing',
'Write scripts for video content',
'Write a video script for [purpose: explainer/interview/training]. Length: [minutes]. Talent: [who is on camera]. Include: hook, key messages, calls to action, and b-roll suggestions. Write for speaking, not reading.',
'Video scripts, video production, content'),

((SELECT id FROM prompt_categories WHERE slug = 'content-creation'),
'Podcast Episode Planning',
'Plan podcast episodes',
'Plan a podcast episode about [topic]. Format: [solo/interview/panel]. Guest (if any): [name and background]. Length: [minutes]. Include: episode title, description, outline, discussion questions, and show notes content.',
'Podcasting, audio content, content planning'),

((SELECT id FROM prompt_categories WHERE slug = 'content-creation'),
'How-To Guide Creation',
'Write helpful how-to content',
'Create a how-to guide for [task]. Target user: [skill level]. Include: overview, step-by-step instructions, screenshots/visual suggestions, common mistakes to avoid, and troubleshooting tips. Make it actually useful.',
'How-to guides, tutorials, help content'),

((SELECT id FROM prompt_categories WHERE slug = 'content-creation'),
'FAQ Content Development',
'Develop comprehensive FAQs',
'Develop FAQ content for [product/service/topic]. Audience: [who will read]. Include: question gathering approach, answers to [number] common questions, and format for easy scanning. Group by topic if applicable.',
'FAQs, help content, customer support'),

((SELECT id FROM prompt_categories WHERE slug = 'content-creation'),
'Infographic Content',
'Create infographic content',
'Create content for an infographic about [topic]. Key data/facts: [list]. Include: headline, narrative flow, callout text, and source citations. Design for visual impact and shareability.',
'Infographics, visual content, data visualization'),

((SELECT id FROM prompt_categories WHERE slug = 'content-creation'),
'Whitepaper Outline',
'Structure thought leadership whitepapers',
'Create an outline for a whitepaper on [topic]. Target audience: [describe]. Purpose: [thought leadership/lead gen]. Length: [pages]. Include: executive summary approach, section breakdown, research needs, and call to action.',
'Whitepapers, thought leadership, B2B content'),

((SELECT id FROM prompt_categories WHERE slug = 'content-creation'),
'Employee Bio Writing',
'Write professional employee bios',
'Write a professional bio for [name, role]. Length: [short/medium/long]. Tone: [formal/conversational]. Include: role, background, expertise, interesting facts. Provide first-person and third-person versions.',
'Bios, profiles, about content'),

((SELECT id FROM prompt_categories WHERE slug = 'content-creation'),
'Email Newsletter Content',
'Create newsletter content',
'Create content for a [frequency] newsletter. Audience: [describe]. Topics to cover: [list]. Include: engaging headlines, brief content blocks, links, and consistent format. Aim for [reading time] minutes.',
'Newsletters, email content, engagement'),

((SELECT id FROM prompt_categories WHERE slug = 'content-creation'),
'Customer Success Story',
'Write customer success narratives',
'Write a customer success story about [customer]. Challenge: [what they struggled with]. Solution: [how we helped]. Results: [outcomes and metrics]. Include: narrative arc, pull quotes, and before/after contrast.',
'Customer stories, case studies, testimonials'),

((SELECT id FROM prompt_categories WHERE slug = 'content-creation'),
'Website Copy Review',
'Improve website copy',
'Review and improve this website copy: [paste content]. Page purpose: [what it should accomplish]. Issues to address: [clarity/conversion/SEO]. Provide: improved version with explanation of changes.',
'Website copy, copywriting, conversion'),

((SELECT id FROM prompt_categories WHERE slug = 'content-creation'),
'Presentation Content',
'Develop presentation content',
'Develop content for a presentation about [topic]. Audience: [describe]. Duration: [minutes]. Key messages: [list]. Include: slide-by-slide content outline, speaker notes points, and visual suggestions.',
'Presentations, slide content, speaking'),

((SELECT id FROM prompt_categories WHERE slug = 'content-creation'),
'Training Content Development',
'Create training materials',
'Create training content for [topic]. Learner level: [beginner/intermediate]. Format: [self-paced/instructor-led]. Include: learning objectives, module outline, key concepts, exercises, and assessment questions.',
'Training content, e-learning, instructional design'),

((SELECT id FROM prompt_categories WHERE slug = 'content-creation'),
'Social Media Campaign',
'Create social media campaign content',
'Create a social media campaign for [goal]. Platforms: [list]. Duration: [timeframe]. Include: campaign theme, post calendar with content, hashtags, and visual direction for each post type.',
'Social media campaigns, content calendar, marketing'),

((SELECT id FROM prompt_categories WHERE slug = 'content-creation'),
'Content Repurposing Plan',
'Maximize content value',
'Create a repurposing plan for [original content: webinar/blog post/etc.]. Potential formats: [list options]. Include: which formats to create, content modifications for each, and distribution plan. Maximize reach from one effort.',
'Content repurposing, efficiency, distribution'),

((SELECT id FROM prompt_categories WHERE slug = 'content-creation'),
'Product Description Writing',
'Write compelling product descriptions',
'Write product descriptions for [product/service]. Target buyer: [describe]. Key features: [list]. Include: headline, benefit-focused description, feature list, and urgency/action element. Tone: [brand voice].',
'Product descriptions, copywriting, e-commerce'),

((SELECT id FROM prompt_categories WHERE slug = 'content-creation'),
'Internal Communication Content',
'Create internal comms content',
'Create internal communication content about [topic]. Audience: [all employees/specific group]. Channel: [email/intranet/Slack]. Include: headline, key messages, action required (if any), and questions to address.',
'Internal comms, employee communication, change management'),

((SELECT id FROM prompt_categories WHERE slug = 'content-creation'),
'Ebook Chapter Outline',
'Structure ebook content',
'Create an outline for an ebook chapter about [topic]. Book title: [name]. Chapter position: [which chapter]. Include: chapter introduction, section breakdown, key points, examples to include, and chapter summary/transition.',
'Ebooks, long-form content, lead generation'),

((SELECT id FROM prompt_categories WHERE slug = 'content-creation'),
'Content Style Guide',
'Create content standards',
'Create a content style guide for [company/department]. Cover: voice and tone, formatting standards, grammar preferences, terminology, and accessibility. Include examples for each guideline. Make it practical for content creators.',
'Style guides, content standards, brand consistency')
