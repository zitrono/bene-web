# PE Data Source Classification Matrix

**Primary Dimension:** Deal Lifecycle Stage (rows)  
**Secondary Dimension:** Access Level (columns)

| Deal Stage | Public | Semi-private (Paid/Subscription) | Private/Proprietary | Confidential (NDA-Protected) |
|------------|--------|----------------------------------|---------------------|------------------------------|
| **Sourcing & Screening** | SEC filings (10-K, 10-Q), Company websites, Press releases, LinkedIn profiles, Patent databases, Court records, Social media sentiment | PitchBook/Preqin, Capital IQ, Gartner/Forrester reports, Industry associations, Trade publications, Broker research, AlphaSense transcripts | Internal deal flow CRM, Partner referral network, Portfolio company leads, Proprietary sector maps, Historical deal memos, Relationship graphs | Investment bank teasers, Broker confidential memos, Management presentations, Early data room access, Exclusive deal terms, Bilateral discussions |
| **Due Diligence** | Regulatory filings, Customer reviews (Glassdoor, G2), Public litigation records, Environmental records, Building permits, Government contracts | Dun & Bradstreet, Background check services, Expert networks (GLG, AlphaSights), Industry benchmarking data, Compensation surveys, Credit reports | Internal DD checklists, Prior DD reports, Proprietary models, Reference call notes, Advisor work product, Pattern recognition data | Virtual data room, Management accounts, Customer contracts, Employee records, Detailed financials, Quality of earnings, Commercial DD reports, Target company ERP/CRM data exports |
| **Portfolio Management** | Competitor announcements, Market share data, Industry news, Regulatory changes, Public benchmarks, Economic indicators | Board governance tools (Diligent), Benchmarking services, Market intelligence platforms, Industry KPI databases, Executive search databases | Board reporting packs, Monthly KPI dashboards, 100-day plans, Value creation playbooks, Cross-portfolio insights, Operating partner notes, Portfolio company ERP systems (SAP, Oracle, NetSuite), Portfolio company CRM systems (Salesforce, HubSpot, Dynamics) | Management reports, Strategic plans, Budget details, Sensitive HR matters, M&A pipeline, Confidential initiatives, Real-time ERP/CRM dashboards, Customer pipeline data |
| **Exit Preparation** | Public market comps, Recent transaction multiples, IPO filings, Analyst coverage, Market conditions, Buyer announcements | Mergermarket, Dealogic, Buyer landscape reports, Sector research, Valuation services, Exit readiness assessments | Exit timing models, Buyer relationship mapping, Historical exit analyses, LP preference data, Internal return hurdles, Consolidated ERP/CRM reporting, Historical system performance data | Buyer IOIs, Preliminary bids, Strategic buyer synergies, Competitive process data, Final bid packages, SPA negotiations, ERP/CRM system documentation for buyers |

## Key Observations

### Horizontal Patterns (by stage)
- **Sourcing:** Relies heavily on public and semi-private data for scale
- **Due Diligence:** Requires maximum access to confidential information
- **Portfolio Management:** Balances external benchmarks with internal operations
- **Exit:** Combines market intelligence with highly confidential negotiations

### Vertical Patterns (by access)
- **Public:** Provides market context and compliance baseline
- **Semi-private:** Offers professional-grade analysis and benchmarks
- **Private:** Contains institutional knowledge and competitive advantages
- **Confidential:** Drives actual transaction decisions and value creation

### Implementation Guidelines

**Access Control**
- Public: Open to all agents and team members
- Semi-private: Requires verified firm subscription
- Private: Limited to deal team and senior staff
- Confidential: Deal-specific authorized personnel only

**Portfolio Company Systems Integration**
- ERP/CRM systems require special handling as they bridge Private and Confidential categories
- During DD: Limited data exports via secure channels
- During Portfolio Management: Direct API access or data warehouse connections
- During Exit: Controlled access for buyer due diligence
- Common systems: SAP, Oracle, NetSuite, Salesforce, HubSpot, Microsoft Dynamics

**Agent Design Implications**
- Sourcing agents need broad public/semi-private access
- DD agents require dynamic permission escalation
- Portfolio agents need persistent company data access including ERP/CRM APIs
- Exit agents must handle highly sensitive negotiations and system documentation

**Critical Integration Points**
- Public + Confidential = Context-aware decision making
- Semi-private + Private = Benchmarked performance insights
- Portfolio ERP/CRM + Market data = Real-time value creation insights
- All levels needed for complete mosaic theory compliance