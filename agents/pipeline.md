---
name: Hedge Fund War Room Pipeline
description: Multi-agent pipeline connecting Research → Fund Agents → War Room → Alpha Extractor
---

# Hedge Fund War Room Pipeline

## Flow Architecture

```
┌─────────────────────────────┐
│   Research Orchestrator      │  ← Ingests hedge_fund_research.md
│         (Agent 1)            │
└─────────────┬───────────────┘
              │
              │  distributes context to all 5 fund agents
              │
    ┌─────────┼─────────┐─────────┐─────────┐
    ▼         ▼         ▼         ▼         ▼
┌────────┐┌────────┐┌────────┐┌────────┐┌────────┐
│ Quant  ││ Macro  ││  Pod   ││Activist││ Rates  │
│ Rentech││Bridgewt││Millenn.││Elliott ││Brevan H│
│(Agt 2) ││(Agt 3) ││(Agt 4) ││(Agt 5) ││(Agt 6) │
└───┬────┘└───┬────┘└───┬────┘└───┬────┘└───┬────┘
    │         │         │         │         │
    │    each produces a Positioning Memo    │
    │         │         │         │         │
    └─────────┴────┬────┴─────────┴─────────┘
                   │
                   ▼
     ┌─────────────────────────────┐
     │   War Room – Moderator      │  ← Synthesizes all 5 memos
     │         (Agent 7)           │
     │                             │
     │  Outputs:                   │
     │  • Crowded Longs            │
     │  • Divergent Alpha          │
     │  • Fade Signals             │
     │  • Consensus Summary        │
     └─────────────┬───────────────┘
                   │
                   ▼
     ┌─────────────────────────────┐
     │     Alpha Extractor         │  ← Produces Agentic 13F
     │         (Agent 8)           │
     │                             │
     │  Outputs:                   │
     │  • Projected holdings table │
     │  • Fidelity scores          │
     │  • Methodology note         │
     └─────────────────────────────┘
```

## Pipeline Stages

### Stage 1: Research Ingestion
- **Agent:** Research Orchestrator
- **Input:** `hedge_fund_research.md` (compiled research report)
- **Output:** Structured fund profiles distributed to all 5 fund agents

### Stage 2: Positioning Memos (Parallel)
- **Agents:** Quant, Macro, Pod Shop, Activist, Rates Trader
- **Input:** Fund profile context + Market shock scenario
- **Output:** 5 independent Positioning Memos
- **Execution:** All 5 run in parallel — no dependencies between them

### Stage 3: War Room Synthesis
- **Agent:** War Room Moderator
- **Input:** All 5 Positioning Memos
- **Output:** Crowded Longs, Divergent Alpha, Fade Signals, Consensus Summary

### Stage 4: Alpha Extraction
- **Agent:** Alpha Extractor
- **Input:** Full War Room output
- **Output:** Agentic 13F table with fidelity scores

## Market Shock (Current Scenario)
> "Oil prices spike to $120 per barrel due to a sudden Middle East supply disruption. Markets are pricing in CPI re-acceleration. The Fed is now expected to pause rate cuts."
