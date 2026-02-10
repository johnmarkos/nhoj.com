// Instance configuration for System Design Practice.
// This file is the only thing that differs from the OpenQuizzer template.
// To upgrade: copy openquizzer.js, openquizzer.test.js, and index.html
// from the OpenQuizzer repo. This file and content/ are untouched.

export const CONFIG = {
  title: "System Design Practice",
  description:
    "Build fluency in system design reasoning. Phone-friendly problems you can do in 5 minutes.",
  backLink: { href: "../", text: "\u2190 Back to AI Code" },
  showProblemId: true,
  units: [
    {
      id: 1,
      title: "Estimation",
      chapters: [
        { num: 1, title: "Reference Numbers", ready: true },
        { num: 2, title: "Time Math", ready: true },
        { num: 3, title: "Storage Math", ready: true },
        { num: 4, title: "Bandwidth Math", ready: true },
        { num: 5, title: "QPS & Load", ready: true },
        { num: 6, title: "Growth Projections", ready: true },
        { num: 7, title: "Reasonableness Checks", ready: true },
        { num: 8, title: "Compound Scenarios", ready: true },
      ],
    },
    {
      id: 2,
      title: "Data Modeling",
      chapters: [
        { num: 1, title: "Entity Identification", ready: true },
        { num: 2, title: "Relationships", ready: true },
        { num: 3, title: "Keys & Indexes", ready: true },
        { num: 4, title: "Normalization", ready: true },
        { num: 5, title: "Denormalization", ready: true },
        { num: 6, title: "Access Patterns", ready: true },
        { num: 7, title: "Schema Evolution", ready: true },
        { num: 8, title: "Modeling Scenarios", ready: true },
      ],
    },
    {
      id: 3,
      title: "API Design",
      chapters: [
        { num: 1, title: "REST Fundamentals", ready: true },
        { num: 2, title: "API Modeling", ready: true },
        { num: 3, title: "Pagination & Filtering", ready: true },
        { num: 4, title: "Rate Limiting & Quotas", ready: true },
        { num: 5, title: "Versioning & Evolution", ready: true },
        { num: 6, title: "Error Handling", ready: true },
        { num: 7, title: "GraphQL & Alternatives", ready: true },
        { num: 8, title: "API Design Scenarios", ready: true },
      ],
    },
    {
      id: 4,
      title: "Storage Selection",
      chapters: [
        { num: 1, title: "Relational Databases", ready: true },
        { num: 2, title: "Document Stores", ready: true },
        { num: 3, title: "Key-Value Stores", ready: true },
        { num: 4, title: "Wide-Column & Time-Series", ready: true },
        { num: 5, title: "Graph & Search Engines", ready: true },
        { num: 6, title: "Object Storage", ready: true },
        { num: 7, title: "Hybrid Architectures", ready: true },
        { num: 8, title: "Storage Selection Scenarios", ready: true },
      ],
    },
    {
      id: 5,
      title: "Caching",
      chapters: [
        { num: 1, title: "Cache Fundamentals", ready: true },
        { num: 2, title: "Cache Placement", ready: true },
        { num: 3, title: "Caching Strategies", ready: true },
        { num: 4, title: "TTLs & Expiration", ready: true },
        { num: 5, title: "Cache Invalidation", ready: true },
        { num: 6, title: "Eviction Policies", ready: true },
        { num: 7, title: "Distributed Caching", ready: true },
        { num: 8, title: "Caching Scenarios", ready: true },
      ],
    },
    {
      id: 6,
      title: "Messaging & Async",
      chapters: [
        { num: 1, title: "Queue Fundamentals", ready: true },
        { num: 2, title: "Pub/Sub & Topics", ready: true },
        { num: 3, title: "Delivery Guarantees", ready: true },
        { num: 4, title: "Patterns & Reliability", ready: true },
        { num: 5, title: "Event-Driven Architecture", ready: true },
        { num: 6, title: "Stream Processing", ready: true },
        { num: 7, title: "Technology Selection", ready: true },
        { num: 8, title: "Messaging Scenarios", ready: true },
      ],
    },
    {
      id: 7,
      title: "Scaling Compute",
      chapters: [
        { num: 1, title: "Load Balancing Fundamentals", ready: true },
        { num: 2, title: "Statelessness & Session Strategy", ready: true },
        {
          num: 3,
          title: "Horizontal vs Vertical Scaling Decisions",
          ready: true,
        },
        { num: 4, title: "Autoscaling Signals & Policies", ready: true },
        {
          num: 5,
          title: "Hotspots, Sharding & Work Distribution",
          ready: true,
        },
        { num: 6, title: "Multi-Region Compute Strategy", ready: true },
        {
          num: 7,
          title: "Compute Selection & Platform Trade-offs",
          ready: true,
        },
        { num: 8, title: "Scaling Compute Scenarios", ready: true },
      ],
    },
    {
      id: 8,
      title: "Consistency & Coordination",
      chapters: [
        { num: 1, title: "Consistency Models Fundamentals", ready: true },
        {
          num: 2,
          title: "Quorums, Replication & Read/Write Paths",
          ready: true,
        },
        { num: 3, title: "Time, Ordering & Causality", ready: true },
        {
          num: 4,
          title: "Transactions & Isolation in Distributed Systems",
          ready: true,
        },
        {
          num: 5,
          title: "Coordination Patterns & Distributed Locking",
          ready: true,
        },
        {
          num: 6,
          title: "Consensus & Membership",
          ready: true,
        },
        { num: 7, title: "Conflict Resolution & Convergence", ready: true },
        { num: 8, title: "Consistency & Coordination Scenarios", ready: true },
      ],
    },
    {
      id: 9,
      title: "Reliability",
      chapters: [
        { num: 1, title: "Failure Modes & Fault Domains", ready: true },
        { num: 2, title: "Timeouts, Retries & Backoff Control", ready: true },
        {
          num: 3,
          title: "Circuit Breakers, Load Shedding & Admission Control",
          ready: true,
        },
        {
          num: 4,
          title: "Redundancy, Replication & Failover Strategy",
          ready: true,
        },
        {
          num: 5,
          title: "Graceful Degradation & Dependency Isolation",
          ready: true,
        },
        { num: 6, title: "Data Safety, Durability & Recovery", ready: true },
        { num: 7, title: "Reliability Engineering Operations", ready: true },
        { num: 8, title: "Reliability Scenarios", ready: true },
      ],
    },
    {
      id: 10,
      title: "Classic Designs Decomposed",
      chapters: [
        { num: 1, title: "Twitter/X Timeline Write & Fanout", ready: true },
        {
          num: 2,
          title: "Twitter/X Timeline Ranking, Serving & Reliability",
          ready: true,
        },
        { num: 3, title: "URL Shortener Core Architecture", ready: true },
        {
          num: 4,
          title: "URL Shortener Scale, Analytics & Operations",
          ready: true,
        },
        { num: 5, title: "Chat Core Messaging Architecture", ready: true },
        { num: 6, title: "Chat Presence, Sync & Reliability", ready: true },
        {
          num: 7,
          title: "Notification System Core Architecture",
          ready: true,
        },
        {
          num: 8,
          title: "Notification System Scale & Scenarios",
          ready: true,
        },
      ],
    },
  ],
};
