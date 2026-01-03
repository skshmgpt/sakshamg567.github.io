The Math Behind LinkedIn’s Real-Time Social Network
===================================================


![captionless image](https://miro.medium.com/v2/resize:fit:1184/format:webp/0*53XTS7l3hU1wDl_6)

> Ever wondered how Linkedin instantly knows if someone’s your 2nd or 3rd connection, in a graph with millions of members and billions of connections? Spoiler: it’s not some magic, it’s math.

In this Blog, we are gonna be deep diving into the maths and algorithms that makes this possible in real time.

Member Representation
---------------------

When you create an account on Linkedin, you are represented as a vertex in linkedin’s social graph. Each connection you add, is represented as an edge.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*MTaQmX_Dq4_BrXmxarFI5w.png)

Social Networks require the ability to perform various graph computations, like:

*   Calculating your direct connections
*   Finding shared connections b/w two members
*   Calculating the distance b/w members (1st / 2nd / 3rd degree)

The first two operations are pretty cheap, but computing graph distance at linkedin’s scale, that’s where things get tricky.

Why naive BFS Fails :
---------------------

Social Graphs are huge, with hundreds of millions of vertices and billions of edges. The Graphs are stored in a distributed fashion, split into partitions, with each node (a physical machine) holding a few partitions.

If you run BFS on this graph, the system will likely blow up :

*   Complexity : About O(n²) remote calls, where **n** is avg number of connections per member.
*   It would touch every machine in the cluster
*   Massive latency

![Naive BFS Approach](https://miro.medium.com/v2/resize:fit:1192/format:webp/0*MMRYKbP-UjljY_Pp.gif)

Bi-Directional BFS + Caching
----------------------------

Linkedin tackles this using a smart approach.

*   They precompute upto 2nd degree connections of each user, and store them in a cache.

Each `GetDistance` call becomes a simple set intersection problem — way faster.

![Bi-directional BFS](https://miro.medium.com/v2/resize:fit:1192/format:webp/0*dYZbYeDFzcAXJnU6.gif)

But, here’s a catch, cache misses. When the second degree connections aren’t cached, we have to compute those _on the fly._

The Real-Time Challenge
-----------------------

To build a member’s 2nd degree array on the fly, we have to:

*   Fetch First Degree Connections from the GraphDB.
*   Query their First Degree Connections.
*   Merge Results while removing Duplicates.

Since graphs are super interconnected, we get tons of duplicates. Doing all the merging at the caching layer is expensive and slow.

Ideally, we want to push maximum merging to GraphDB Nodes themselves, which requires the optimal set of GraphDB Nodes that can serve our request.

So, the problem boils down to selecting the optimal set of GraphDB Nodes, that can cover all the required partitions for a member’s second-degree network. This is an application of the set-cover Algorithm

Set-Cover in a Distributed Graph
--------------------------------

> Given a set of elements, and a bunch of subsets whose union gives us the original set, the classic set cover problem is to find a minimum number of subsets whose union will be equal to the original set.

In our case, set cover problem will be to find the minimum number of GraphDB nodes to cover all the required partitions to serve a member’s second degree.

Now, classic set cover problem is [NP Hard](https://en.wikipedia.org/wiki/NP-hardness), so linkedin uses a greedy approximation to make it work at scale. It works by picking that subset, at each iteration, that covers most remaining uncovered elements in the set.

An example of how greedy set cover algorithm works :

Assume we have a distributed Graph with 6 partitions. We store 2 partitions on each node, with 2 replicas.

Say a member’s second-degree connections lie on partitions {1, 2, 3, 4, 6}. Our sets (nodes) look like this:

*   Node R11 → {1, 2}
*   Node R12 → {3, 4}
*   Node R13 → {5, 6}
*   Node R21 → {1, 5}
*   Node R22 → {2, 4}
*   Node R23 → {3, 6}

![captionless image](https://miro.medium.com/v2/resize:fit:396/format:webp/1*MTrCobzBK-w1isXhD4GcCA.png)

Running our greedy set cover algo:

1.  K= {1, 2, 3, 4, 6}. Pick R11 -> covers {1, 2}. Now K = {3, 4, 6}.
2.  From remaining, pick R23 -> covers {3, 6}. Now K = {4}.
3.  Finally pick R12 -> covers {3, 4}. Done

We only touched 3 nodes instead of all 6 -> ~50% fan-out reduction

Optimizing Further
------------------

If you noticed, we picked out best coverage set at each iteration by intersecting every set of partitions with set of required partitions, which is ~O(l²) operations ( l being the number of sets of partitions) . This adds up to a significant latency as number of connections grow.

We can optimize this, by exploiting the fact that each set of partitions in our GraphDB is disjoint. So, instead of intersecting with every node, we only check those subsets in L with K, which are likely to provide best coverage.

```
C ← 0 /
repeat
  pk ← randomly selected partition from K
  nodes ← map[pk ] // pick out nodes covering pk
  for node from nodes not added to C do
    Find nodek with coverage Sk maximizing | K ∩ Si |
  end for
  K ← K − Sk
  C ← C ∪ {nodek }
until C covers all elements in K
return C
```

> modified set cover algorithm

This dramatically cuts down the set interactions, saving precious milliseconds in real-time queries.

Results
-------

LinkedIn’s modified set cover approach produced massive results :

*   18% drop in latency for top 5% users
*   38% drop in latency in building cache
*   25% drop in latency for worst case distance lookups
*   40% less outbound traffic across the cluster

Wrapping Up
-----------

Next time you see those little “1st”, “2nd” or “3rd” label above someone’s profile, remember the clever maths and engineering going on behind the scenes. By framing second-degree queries as a set-cover problem, linkedin was able to cut down fan out, reduce merges, and serve graph distances in real time.

That’s the beauty of maths and engineering, invisible to a user, but keeps these massive systems running smoothly.

> That tiny ‘2nd’ label you see? It’s backed by one of the hardest problems in Computer Science. Wild, right?
