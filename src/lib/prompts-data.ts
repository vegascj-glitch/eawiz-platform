// Hard-coded prompts data for v1
// Categories and prompts curated for Executive Assistants

export interface PromptCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
}

export interface Prompt {
  id: string;
  categoryId: string;
  title: string;
  description: string;
  promptText: string;
  useCases: string[];
  isFeatured?: boolean;
}

export const categories: PromptCategory[] = [
  {
    id: 'career-growth',
    name: 'Career & Growth',
    slug: 'career-growth',
    description: 'Prompts for professional development, performance reviews, and career advancement.',
    icon: '🚀',
  },
  {
    id: 'meetings',
    name: 'Meetings',
    slug: 'meetings',
    description: 'Meeting preparation, agendas, follow-ups, and facilitation prompts.',
    icon: '📋',
  },
  {
    id: 'inbox-communications',
    name: 'Inbox & Communications',
    slug: 'inbox-communications',
    description: 'Email drafting, inbox triage, and professional communication templates.',
    icon: '📧',
  },
  {
    id: 'travel',
    name: 'Travel',
    slug: 'travel',
    description: 'Travel planning, itinerary creation, and logistics management.',
    icon: '✈️',
  },
  {
    id: 'events',
    name: 'Events',
    slug: 'events',
    description: 'Event planning, vendor coordination, and on-site logistics.',
    icon: '🎉',
  },
  {
    id: 'strategy-operations',
    name: 'Strategy & Operations',
    slug: 'strategy-operations',
    description: 'Strategic planning, process improvement, and operational efficiency.',
    icon: '📊',
  },
  {
    id: 'tools-systems',
    name: 'Tools & Systems',
    slug: 'tools-systems',
    description: 'Technology adoption, system documentation, and workflow automation.',
    icon: '⚙️',
  },
];

export const prompts: Prompt[] = [
  // Career & Growth
  {
    id: 'cg-1',
    categoryId: 'career-growth',
    title: 'Self-Assessment for Performance Review',
    description: 'Generate a comprehensive self-assessment highlighting your accomplishments and growth areas.',
    promptText: `Act as a career coach specializing in Executive Assistant roles. Help me write a compelling self-assessment for my annual performance review.

My role: [Executive Assistant to CEO/SVP/etc.]
Time period: [Review period, e.g., Jan-Dec 2024]
Key accomplishments this period:
- [List 3-5 major accomplishments]

Growth areas I've been working on:
- [List 1-2 areas]

Please generate a self-assessment that:
1. Opens with a strong summary of my overall performance and value
2. Highlights each accomplishment with specific metrics and business impact
3. Frames growth areas as learning opportunities with concrete steps taken
4. Demonstrates strategic thinking and partnership with leadership
5. Closes with goals for the next review period

Use a professional but confident tone. Quantify impact wherever possible.`,
    useCases: ['Performance reviews', 'Career development', 'Promotion preparation'],
    isFeatured: true,
  },
  {
    id: 'cg-2',
    categoryId: 'career-growth',
    title: 'Career Conversation Prep',
    description: 'Prepare talking points for a career development conversation with your manager.',
    promptText: `Help me prepare for a career development conversation with my manager.

Current role: [Your title]
Time in role: [Duration]
Career goals: [Where you want to go - e.g., Chief of Staff, Operations Manager, Senior EA]
Current challenges: [What's blocking your growth]

Please help me:
1. Draft 3-5 thoughtful questions to ask my manager about growth opportunities
2. Prepare talking points about my aspirations without sounding entitled
3. Suggest ways to frame requests for stretch assignments or new responsibilities
4. Create a list of skills I should develop and how to articulate my commitment
5. Anticipate objections and prepare responses

Keep the tone collaborative and growth-focused rather than demanding.`,
    useCases: ['Manager meetings', 'Career planning', 'Development conversations'],
  },
  {
    id: 'cg-3',
    categoryId: 'career-growth',
    title: 'Accomplishment Story Generator',
    description: 'Transform a workplace win into a compelling STAR format story.',
    promptText: `Transform this accomplishment into a compelling story using the STAR format (Situation, Task, Action, Result).

My accomplishment: [Describe what you did in 2-3 sentences]
Context: [Any relevant background]
My role: [Your title and who you support]

Please generate:
1. A polished STAR format story (250-300 words) suitable for interviews or reviews
2. A 2-sentence elevator pitch version
3. 3 potential follow-up questions an interviewer might ask, with suggested responses
4. Quantified metrics I should include (suggest reasonable estimates if I haven't provided them)

Make the story demonstrate executive-level thinking, proactive problem-solving, and measurable business impact.`,
    useCases: ['Job interviews', 'Performance reviews', 'LinkedIn updates'],
  },
  {
    id: 'cg-4',
    categoryId: 'career-growth',
    title: 'Salary Negotiation Script',
    description: 'Prepare for a compensation discussion with confidence and data.',
    promptText: `Help me prepare for a salary/compensation negotiation.

Current compensation: [Base salary, bonus, etc.]
Target compensation: [What you're asking for]
Market data: [Any salary research you've done]
Your tenure: [Time at company]
Recent wins: [2-3 accomplishments]
Company context: [Any relevant info - budget cycles, recent funding, etc.]

Please provide:
1. An opening statement that confidently states my ask
2. 3-4 supporting points that justify the increase
3. Responses to common pushback ("budget is tight," "not the right time," "you're already at top of band")
4. A BATNA (Best Alternative to Negotiated Agreement) strategy
5. Phrases to use and phrases to avoid
6. A suggested negotiation timeline and next steps to propose

Tone should be confident, collaborative, and professional - not demanding or apologetic.`,
    useCases: ['Salary negotiations', 'Promotion discussions', 'Annual reviews'],
  },

  // Meetings
  {
    id: 'mtg-1',
    categoryId: 'meetings',
    title: 'Executive Meeting Prep Brief',
    description: 'Generate a comprehensive pre-meeting brief for your executive.',
    promptText: `Create a pre-meeting brief for my executive.

Meeting: [Meeting name/type]
Date/Time: [When]
Attendees: [Who will be there and their roles]
Meeting purpose: [What the meeting is about]
Context: [Any background your executive needs]
Key decisions needed: [If any]
Sensitive topics: [Anything to be aware of]

Please generate a brief that includes:
1. One-paragraph executive summary of the meeting purpose and expected outcomes
2. Attendee profiles with relevant context (reporting relationships, recent interactions, any sensitivities)
3. Recommended talking points (3-5 bullets)
4. Questions your executive might be asked, with suggested responses
5. Pre-meeting actions to consider (emails to send, materials to review)
6. Post-meeting follow-up actions to anticipate

Format for quick scanning with headers and bullet points.`,
    useCases: ['Board meetings', 'External meetings', 'High-stakes discussions'],
    isFeatured: true,
  },
  {
    id: 'mtg-2',
    categoryId: 'meetings',
    title: 'Meeting Agenda Generator',
    description: 'Create a structured agenda that drives productive meetings.',
    promptText: `Create a professional meeting agenda.

Meeting type: [Staff meeting, project kickoff, 1:1, brainstorm, etc.]
Duration: [Time allotted]
Attendees: [Who will be there]
Primary objective: [What must be accomplished]
Topics to cover: [List items to discuss]
Pre-work: [Any materials attendees should review]

Please generate:
1. A professionally formatted agenda with time allocations for each item
2. Clear objectives and desired outcomes for each agenda item
3. Owner assignments for each discussion topic
4. Suggested discussion questions to drive engagement
5. A parking lot section for off-topic items
6. Next steps/action items template for the end

Include a header with meeting details and instructions for attendees.`,
    useCases: ['Staff meetings', 'Project meetings', 'Team meetings'],
  },
  {
    id: 'mtg-3',
    categoryId: 'meetings',
    title: 'Meeting Notes to Action Items',
    description: 'Transform messy meeting notes into clear action items and summaries.',
    promptText: `Transform these meeting notes into a polished summary with clear action items.

Raw notes:
[Paste your messy meeting notes here]

Meeting details:
- Meeting name: [Name]
- Date: [Date]
- Attendees: [Who was there]

Please generate:
1. Executive summary (3-4 sentences capturing key decisions and outcomes)
2. Discussion highlights organized by topic
3. Decisions made (clearly stated with rationale if available)
4. Action items table with: Task | Owner | Due Date | Priority
5. Open questions or items requiring follow-up
6. Next meeting date/agenda items (if discussed)

Format for easy sharing via email. Use clear headers and bullet points.`,
    useCases: ['Meeting follow-ups', 'Team communication', 'Documentation'],
  },
  {
    id: 'mtg-4',
    categoryId: 'meetings',
    title: 'Difficult Conversation Prep',
    description: 'Prepare for a challenging meeting or conversation with stakeholders.',
    promptText: `Help me prepare for a difficult conversation/meeting.

Situation: [What's the issue or topic]
The other party: [Who you're meeting with and their role]
Their likely perspective: [What they might think/feel]
My goal: [What outcome you want]
Constraints: [Any limitations or sensitivities]
Relationship context: [History, power dynamics, etc.]

Please provide:
1. An opening statement that sets a collaborative tone
2. Key points to make, ordered strategically
3. Active listening prompts and empathy statements to use
4. Anticipated objections with calm, professional responses
5. Phrases to de-escalate if emotions rise
6. A suggested close that confirms next steps
7. What NOT to say (common pitfalls to avoid)

Help me be assertive but diplomatic, firm but empathetic.`,
    useCases: ['Conflict resolution', 'Difficult feedback', 'Negotiation'],
  },

  // Inbox & Communications
  {
    id: 'ic-1',
    categoryId: 'inbox-communications',
    title: 'Email Drafter - Multiple Tones',
    description: 'Draft the same message in multiple tones to choose from.',
    promptText: `Draft an email for me in multiple tones so I can choose the best approach.

Purpose: [What this email needs to accomplish]
Recipient: [Who it's going to and their role/relationship]
Key points to include:
- [Point 1]
- [Point 2]
- [Point 3]
Context: [Any background they need]
Call to action: [What you want them to do]

Please provide 3 versions:
1. **Formal/Professional** - Appropriate for executives, external parties, or first-time contacts
2. **Friendly/Warm** - Appropriate for colleagues you know well, internal team
3. **Direct/Concise** - Minimum words, busy recipient, time-sensitive

For each version include:
- Subject line options (2-3)
- The email body
- Suggested sign-off

Keep each version under 150 words for the body.`,
    useCases: ['Executive communication', 'Stakeholder emails', 'Client correspondence'],
    isFeatured: true,
  },
  {
    id: 'ic-2',
    categoryId: 'inbox-communications',
    title: 'Decline Request Diplomatically',
    description: 'Say no professionally while maintaining relationships.',
    promptText: `Help me decline this request diplomatically while maintaining a positive relationship.

The request: [What they asked for]
Who asked: [Their role and relationship to you/your executive]
Why I need to decline: [The real reason - be honest]
What I can offer instead: [Alternative, if any]
Relationship importance: [How important is maintaining goodwill]

Please provide:
1. A diplomatic email response that declines clearly but kindly
2. Alternative phrasing options for the "no" (3 variations from soft to firm)
3. A bridge statement to maintain the relationship
4. If appropriate, an alternative solution or compromise to offer
5. A gracious close

The goal is to preserve the relationship while being clear about the boundary. Help me be warm but not apologetic to the point of seeming weak.`,
    useCases: ['Request management', 'Boundary setting', 'Calendar protection'],
  },
  {
    id: 'ic-3',
    categoryId: 'inbox-communications',
    title: 'Inbox Triage Prioritization',
    description: 'Analyze a batch of emails and suggest prioritization.',
    promptText: `Help me triage and prioritize this batch of emails.

[Paste email subjects and senders, or brief descriptions of each email]

My executive's current priorities: [List 2-3]
Today's calendar: [Brief overview of schedule]
Upcoming deadlines: [Any relevant deadlines]

For each email, please categorize into:
1. **Urgent - Exec Action Needed**: Requires my exec's immediate attention
2. **Important - EA to Draft**: I should draft a response for exec approval
3. **EA Can Handle**: I can respond on behalf of my executive
4. **FYI Only**: Information only, no response needed
5. **Can Wait**: Important but not time-sensitive
6. **Archive/Delete**: No action needed

For categories 1-3, also suggest:
- Recommended action
- Suggested response approach (1 sentence)
- Deadline for response`,
    useCases: ['Daily inbox management', 'Email overwhelm', 'Priority setting'],
  },
  {
    id: 'ic-4',
    categoryId: 'inbox-communications',
    title: 'Follow-Up Reminder Email',
    description: 'Craft a polite but effective follow-up to get a response.',
    promptText: `Help me write a follow-up email that gets a response without being pushy.

Original message: [What I initially asked for]
Sent date: [When you first reached out]
Recipient: [Who and their role]
Why I need a response: [Deadline or dependency]
Previous follow-ups: [How many times you've followed up]
Relationship: [External client, internal exec, vendor, etc.]

Please provide:
1. Subject line (consider whether to keep same thread or start new)
2. Email body that:
   - Acknowledges they're busy (without being overly apologetic)
   - Restates the ask clearly and concisely
   - Explains why timing matters
   - Makes it easy to respond (yes/no options, specific questions)
3. A more urgent version if I need to escalate
4. When to send (day of week, time of day recommendation)

Help me be persistent without being annoying.`,
    useCases: ['Getting responses', 'Project management', 'Vendor management'],
  },

  // Travel
  {
    id: 'tr-1',
    categoryId: 'travel',
    title: 'Executive Trip Brief Generator',
    description: 'Create a comprehensive travel brief for executive trips.',
    promptText: `Create a detailed travel brief for my executive's trip.

Trip details:
- Destination: [City, Country]
- Dates: [Travel dates]
- Purpose: [Business meetings, conference, etc.]
- Travelers: [Executive + any others]

Meetings/Events:
[List known meetings with times and locations]

Flight preferences: [Airline, seat, timing preferences]
Hotel preferences: [Chain, room type, location requirements]
Ground transportation preferences: [Car service, rental, etc.]
Dietary restrictions or preferences: [If any]
Known contacts at destination: [People they're meeting]

Please generate a travel brief that includes:
1. Day-by-day itinerary with all logistics
2. Key contact information (meetings, hotels, drivers)
3. Destination overview (weather, time zone, currency, any cultural notes)
4. Packing recommendations based on activities
5. Restaurant recommendations near meeting locations
6. Emergency contacts and nearest hospital/embassy
7. Open questions I need to resolve before the trip`,
    useCases: ['Business travel', 'Conference trips', 'International travel'],
    isFeatured: true,
  },
  {
    id: 'tr-2',
    categoryId: 'travel',
    title: 'Flight Rebooking Communication',
    description: 'Draft communication to handle travel disruptions professionally.',
    promptText: `Help me communicate about a travel disruption professionally.

Situation: [Flight cancelled, delayed, missed connection, etc.]
Current status: [Where your exec is now]
Original itinerary: [What was planned]
Impact: [What meetings or events are affected]
What you need: [New flight, hotel, ground transportation]
Stakeholders to notify: [Who needs to know]

Please provide:
1. Email to my executive explaining the situation and options (concise, solution-focused)
2. Email to affected meeting attendees (professional, apologetic if needed)
3. Script for calling the airline/hotel to get resolution
4. Updated itinerary template once new plans are confirmed
5. Checklist of everything I need to update

Help me stay calm and solution-oriented in the communication.`,
    useCases: ['Travel disruptions', 'Crisis management', 'Stakeholder communication'],
  },
  {
    id: 'tr-3',
    categoryId: 'travel',
    title: 'Visa & Travel Documentation Checklist',
    description: 'Generate a comprehensive checklist for international travel requirements.',
    promptText: `Generate a travel documentation checklist for international travel.

Traveler: [Executive's citizenship]
Destination: [Country/countries]
Trip dates: [When]
Purpose: [Business, conference, client visit]
Passport expiration: [Date]
Previous visas to this country: [If any]
Will they be working or just meeting?: [Nature of activities]

Please provide:
1. Visa requirements and application timeline
2. Required documents checklist
3. Passport validity requirements
4. Vaccination or health requirements
5. Customs/entry considerations (electronics, gifts, cash limits)
6. Business-specific requirements (invitation letters, etc.)
7. Timeline with deadlines for each requirement
8. Resources/links I should check for current requirements

Note any items that require executive action vs EA action.`,
    useCases: ['International travel', 'Visa applications', 'Travel planning'],
  },
  {
    id: 'tr-4',
    categoryId: 'travel',
    title: 'Expense Report Narrative',
    description: 'Generate professional narratives for expense report submissions.',
    promptText: `Help me write professional narratives for expense report line items.

Trip/Event: [What was the expense for]
Date range: [When]
Expenses to document:
[List expenses with amounts and brief context]

Company policy notes: [Any relevant limits or requirements]
Approver: [Who approves these expenses]

For each expense, please provide:
1. A professional business justification (1-2 sentences)
2. How to categorize it properly
3. Any documentation I should attach
4. Red flags to address proactively

Also provide:
- Executive summary for the full report
- Total with breakdown by category
- Notes on any expenses that might need extra justification`,
    useCases: ['Expense reports', 'Travel reimbursement', 'Financial documentation'],
  },

  // Events
  {
    id: 'ev-1',
    categoryId: 'events',
    title: 'Event Planning Timeline Generator',
    description: 'Create a comprehensive timeline for event planning milestones.',
    promptText: `Create a comprehensive event planning timeline.

Event details:
- Event type: [Offsite, board dinner, team building, conference, etc.]
- Date: [Event date]
- Location: [Venue or city]
- Attendees: [Number and type - internal, clients, board, etc.]
- Budget: [If known]
- My role: [Lead planner, supporting, etc.]

Key requirements:
[List must-haves for this event]

Constraints:
[Budget limits, venue restrictions, dietary needs, etc.]

Please generate:
1. Master timeline working backwards from event date with all milestones
2. Categorized task list (Venue, Catering, A/V, Communications, Logistics)
3. Decision points requiring executive input
4. Vendor selection timeline and evaluation criteria
5. Communication plan (save the dates, invitations, reminders)
6. Day-of logistics checklist
7. Post-event tasks (thank yous, feedback, expense reconciliation)

Include buffer time for approvals and delays.`,
    useCases: ['Event planning', 'Offsites', 'Corporate events'],
    isFeatured: true,
  },
  {
    id: 'ev-2',
    categoryId: 'events',
    title: 'Vendor Comparison Matrix',
    description: 'Create a structured comparison of event vendors for decision-making.',
    promptText: `Create a vendor comparison matrix to help with selection.

What I'm sourcing: [Catering, venue, A/V, photographer, etc.]
Event context: [Brief description of the event]
Number of vendors to compare: [How many options]
Budget: [Target budget]
Key requirements: [Must-haves]
Nice-to-haves: [Preferences]

Vendor information:
[List each vendor with their proposal details]

Please create:
1. Comparison matrix with key criteria scored
2. Pros/cons summary for each vendor
3. Questions to ask each vendor for clarification
4. Red flags to watch for in each proposal
5. Recommendation with rationale
6. Negotiation points for the preferred vendor
7. Executive summary for stakeholder review (1 paragraph)

Format the matrix for easy review in a meeting.`,
    useCases: ['Vendor selection', 'RFP evaluation', 'Cost comparison'],
  },
  {
    id: 'ev-3',
    categoryId: 'events',
    title: 'Event Communication Templates',
    description: 'Generate all communications needed for event attendees.',
    promptText: `Generate the full suite of attendee communications for my event.

Event details:
- Event name: [Name]
- Date: [Date]
- Time: [Start/End]
- Location: [Venue with address]
- Attendees: [Who's invited and relationship]
- Dress code: [If applicable]
- RSVP deadline: [Date]

Agenda/Schedule:
[Brief overview of what will happen]

Special instructions:
[Parking, dietary requests, what to bring, etc.]

Please generate:
1. Save the Date email (brief, generates interest)
2. Formal invitation with full details
3. RSVP reminder email
4. Pre-event logistics email (what to expect, what to bring)
5. Day-before reminder
6. Post-event thank you
7. Feedback request email

Include subject lines for each. Vary the tone appropriately for the event type.`,
    useCases: ['Event communication', 'Attendee management', 'RSVPs'],
  },
  {
    id: 'ev-4',
    categoryId: 'events',
    title: 'Day-Of Event Run Sheet',
    description: 'Create a minute-by-minute run sheet for flawless event execution.',
    promptText: `Create a detailed day-of run sheet for my event.

Event: [Event name]
Date: [Date]
Venue: [Location]
Start time: [When guests arrive]
End time: [When event concludes]

Schedule of activities:
[List all planned activities with approximate times]

Key players:
- Event lead: [Name]
- Venue contact: [Name]
- Catering contact: [Name]
- A/V contact: [Name]
- Executive(s): [Names and roles in event]

Critical moments:
[Speeches, presentations, arrivals, transitions]

Please generate:
1. Minute-by-minute run sheet from setup to breakdown
2. Contact sheet with all vendors, phone numbers, roles
3. Responsibility assignments (who handles what when)
4. Backup plans for common issues (A/V fails, speaker late, etc.)
5. Go-bag checklist (what to have on hand)
6. Post-event breakdown checklist

Format for printing and quick reference during the event.`,
    useCases: ['Event execution', 'Day-of coordination', 'Run of show'],
  },

  // Strategy & Operations
  {
    id: 'so-1',
    categoryId: 'strategy-operations',
    title: 'Process Documentation Template',
    description: 'Document a process or procedure in clear, reusable format.',
    promptText: `Help me document this process for future reference and delegation.

Process name: [What it's called]
Purpose: [Why this process exists]
Frequency: [How often it's done]
Current owner: [Who does it now]
Time required: [How long it takes]

Steps (rough):
[List the steps as you understand them]

Tools/Systems used:
[Software, accounts, files needed]

Stakeholders involved:
[Who provides input or approvals]

Please generate:
1. Professional process documentation including:
   - Purpose and scope
   - Prerequisites and access required
   - Step-by-step instructions with screenshots placeholders
   - Decision points and variations
   - Quality checkpoints
   - Troubleshooting common issues
2. Quick reference card (one-page summary)
3. Training outline for teaching this to someone new
4. Suggested improvements or automation opportunities

Format for easy updating as the process evolves.`,
    useCases: ['Process documentation', 'Training materials', 'Delegation'],
  },
  {
    id: 'so-2',
    categoryId: 'strategy-operations',
    title: 'Executive Time Analysis',
    description: 'Analyze how an executive spends their time and identify optimization opportunities.',
    promptText: `Analyze my executive's time allocation and suggest optimizations.

Executive role: [CEO, VP, etc.]
Direct reports: [Number and types]
Key responsibilities: [Main areas of focus]

Current time breakdown (approximate):
- Meetings: [X hours/week]
- Email/Communications: [X hours/week]
- Strategic thinking/planning: [X hours/week]
- 1:1s with directs: [X hours/week]
- External meetings: [X hours/week]
- Travel: [X hours/week]
- Other: [What else]

Known pain points:
[What they complain about or seems inefficient]

Organizational context:
[Growth stage, team size, current priorities]

Please provide:
1. Analysis of current time allocation vs. typical for this role
2. Potential misalignments between time spent and priorities
3. Specific recommendations for time recovery (with estimated hours/week)
4. Meetings that could be delegated, shortened, or eliminated
5. Batch processing opportunities
6. Recommendations I can implement as EA
7. Recommendations requiring exec buy-in (with talking points)`,
    useCases: ['Time optimization', 'Calendar management', 'Executive efficiency'],
    isFeatured: true,
  },
  {
    id: 'so-3',
    categoryId: 'strategy-operations',
    title: 'Quarterly Planning Support',
    description: 'Prepare materials and analysis to support quarterly planning.',
    promptText: `Help me prepare for my executive's quarterly planning process.

Executive role: [Title]
Planning period: [Which quarter]
Team/Department: [What they lead]
Company stage: [Startup, growth, enterprise]

Last quarter recap:
- Key achievements: [What went well]
- Misses: [What didn't happen]
- Surprises: [Unexpected challenges or wins]

Known priorities for upcoming quarter:
[What's already been discussed]

Stakeholder inputs needed from:
[Who provides input to the plan]

Please generate:
1. Pre-planning checklist (data to gather, stakeholders to consult)
2. Template for collecting team input
3. Framework for prioritizing initiatives
4. Questions for my executive to consider before planning
5. Agenda template for planning sessions
6. Communication templates for rolling out the plan
7. Tracking mechanisms to monitor progress

Focus on how I can add value in the planning process.`,
    useCases: ['Quarterly planning', 'Strategic support', 'Team coordination'],
  },
  {
    id: 'so-4',
    categoryId: 'strategy-operations',
    title: 'Stakeholder Relationship Map',
    description: 'Create a map of key stakeholders with engagement strategies.',
    promptText: `Help me create a stakeholder map for my executive.

Executive role: [Title]
Organization type: [Company type]

Key stakeholders to map:
[List internal and external stakeholders - board, peers, reports, clients, etc.]

For each stakeholder provide:
- Relationship strength: [Strong, moderate, needs work]
- Interaction frequency: [How often they meet]
- Key interests/priorities: [What they care about]
- Any tensions or history: [If known]

My executive's goals:
[What they're trying to accomplish]

Please generate:
1. Stakeholder matrix (influence vs. interest)
2. Profile card for each key stakeholder
3. Engagement strategy for each quadrant
4. Recommended touchpoint frequency
5. Relationship maintenance activities I can support
6. Warning signs of relationship degradation
7. Quarterly relationship health review template

Help me proactively manage these relationships as EA.`,
    useCases: ['Stakeholder management', 'Relationship tracking', 'Political navigation'],
  },

  // Tools & Systems
  {
    id: 'ts-1',
    categoryId: 'tools-systems',
    title: 'Software Evaluation Framework',
    description: 'Evaluate a new tool or software for your executive or team.',
    promptText: `Help me evaluate this software/tool for potential adoption.

Tool being evaluated: [Name]
Purpose: [What problem it solves]
Current solution: [What we use now, if anything]
Who would use it: [Executive, team, company-wide]
Budget constraints: [If any]
Integration needs: [Must work with what existing tools]

What I know about it:
[Features, pricing, any demo notes]

Requirements:
- Must have: [List requirements]
- Nice to have: [List preferences]
- Deal breakers: [Absolute no-gos]

Please provide:
1. Evaluation criteria matrix with scoring
2. Questions to ask the vendor/during demo
3. Security and compliance considerations
4. Change management implications
5. ROI framework (time saved, cost reduction)
6. Pilot program recommendation
7. Executive summary for stakeholder buy-in
8. Risk assessment and mitigation plan`,
    useCases: ['Software evaluation', 'Vendor selection', 'Technology adoption'],
  },
  {
    id: 'ts-2',
    categoryId: 'tools-systems',
    title: 'Automation Opportunity Finder',
    description: 'Identify tasks that could be automated to save time.',
    promptText: `Help me identify automation opportunities in my workflow.

My role: [Executive Assistant to X]
Tools I currently use:
[List software, apps, systems]

Recurring tasks I do:
[List regular tasks with frequency]
- Daily: [Tasks]
- Weekly: [Tasks]
- Monthly: [Tasks]
- As needed: [Tasks]

Time estimates for each: [If known]

Pain points:
[What takes too long, what's error-prone, what's tedious]

Please analyze and provide:
1. Tasks ranked by automation potential (high/medium/low)
2. For each high-potential task:
   - Recommended automation approach
   - Tools that could help (Zapier, IFTTT, native features, etc.)
   - Estimated time to set up vs. time saved
   - Complexity rating
3. Quick wins I can implement this week
4. Larger projects to propose to my manager
5. Tasks that should NOT be automated (and why)

Focus on practical automations using tools I have access to.`,
    useCases: ['Workflow optimization', 'Time savings', 'Productivity'],
    isFeatured: true,
  },
  {
    id: 'ts-3',
    categoryId: 'tools-systems',
    title: 'System Access Request Template',
    description: 'Draft professional access requests for IT and security teams.',
    promptText: `Help me draft a system access request.

System/Tool needed: [What you need access to]
Requestor: [Your name or who needs it]
Business justification: [Why it's needed]
Level of access needed: [Admin, edit, view only, etc.]
Duration: [Permanent, temporary, project-based]
Manager approval: [Who approved this]
Similar users: [Others with this access]
Urgency: [When it's needed by and why]

IT/Security team context:
[Anything I know about their requirements]

Please provide:
1. Formal access request email
2. Justification that addresses security concerns
3. Temporary access alternative (if faster)
4. Escalation path if denied
5. Follow-up timeline suggestions

Make the request easy to approve by anticipating concerns.`,
    useCases: ['IT requests', 'Access management', 'Security compliance'],
  },
  {
    id: 'ts-4',
    categoryId: 'tools-systems',
    title: 'Knowledge Base Article Writer',
    description: 'Create clear documentation for team knowledge bases.',
    promptText: `Help me write a knowledge base article for my team.

Topic: [What this article covers]
Audience: [Who will read this - new hires, all EAs, specific team]
Problem it solves: [What question this answers]
Prerequisites: [What readers should know first]

Content to include:
[The information that needs to be documented]

Related resources:
[Links to other docs, tools, contacts]

Please generate:
1. Article with clear hierarchy:
   - Title (searchable, descriptive)
   - Summary/TL;DR
   - Step-by-step content
   - Tips and best practices
   - Common mistakes to avoid
   - Related articles
   - Last updated date
2. Meta description for search
3. Tags/keywords for discoverability
4. FAQ section based on likely questions

Format for our knowledge base platform (Wiki, Notion, Confluence style).`,
    useCases: ['Documentation', 'Knowledge sharing', 'Team resources'],
  },
];

// Helper functions
export function getPromptsByCategory(categoryId: string): Prompt[] {
  return prompts.filter(p => p.categoryId === categoryId);
}

export function getCategoryBySlug(slug: string): PromptCategory | undefined {
  return categories.find(c => c.slug === slug);
}

export function getFeaturedPrompts(): Prompt[] {
  return prompts.filter(p => p.isFeatured);
}

export function searchPrompts(query: string): Prompt[] {
  const lowerQuery = query.toLowerCase();
  return prompts.filter(p =>
    p.title.toLowerCase().includes(lowerQuery) ||
    p.description.toLowerCase().includes(lowerQuery) ||
    p.useCases.some(uc => uc.toLowerCase().includes(lowerQuery))
  );
}

export function getPromptById(id: string): Prompt | undefined {
  return prompts.find(p => p.id === id);
}
