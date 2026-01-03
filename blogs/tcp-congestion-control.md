Why Your Internet Speed Fluctuates (And It’s Not Just ‘Bad WiFi’)
=================================================================


![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*_InsV0-H-DXV04WR.jpg)

List of Contents
----------------

1.  Intro
2.  What Even Is Congestion?
3.  How TCP Handles Congestion
4.  The 4 Phases of TCP Congestion Control
5.  Legacy to Modern Congestion Control

### Intro

Ever wondered why your download speeds suddenly drop outta nowhere and then go blazingly fast the next moment? No, it’s not always your internet acting up this is actually how the protocols powering the internet are _designed_ to work.
If you’re in tech, chances are you’ve heard of **TCP .** It’s the protocol that **HTTP** (and a ton of other stuff) runs on behind the scenes.

In this blog, we’re gonna break down how **TCP** prevents data loss and keeps routers and servers from getting overloaded , aka, how it keeps the internet from collapsing under pressure .

So , what even is congestion?
-----------------------------

On the internet, data moves around in tiny chunks called packets. Even this blog you’re reading? Just a bunch of packets your device reassembled.

Now imagine tons of people sending tons of data at once, all those packets pile up at routers. But routers have limited space. If too much data comes in too fast, they **can’t keep up**. Some packets get delayed, others get dropped.
That’s **network congestion**, when the traffic exceeds what the network can actually handle.

**TCP**, being the responsible one, tries to resend lost packets. But that just adds even _more_ traffic, making congestion worse. It’s a feedback loop: more traffic → more loss → more retries → even more traffic.

This became a huge issue back in the ’80s, so TCP evolved. Enter: **TCP Congestion Control**, a way to back off when the internet’s feeling overwhelmed.

Congestion control
------------------

So, here’s the thing: TCP has zero clue how much bandwidth you’ve got or how much traffic it can send without clogging up the network. It’s not some genius that knows the perfect sweet spot for transferring data efficiently.

Instead, TCP uses Congestion Control to _figure out_ that sweet spot. It kinda plays trial and error, sending data, watching what happens, and adjusting based on how the network reacts.

And that’s where the different TCP Congestion Control phases come in. These phases help TCP learn, adapt, and avoid causing any chaos.

TCP goes through 4 key phases:

1.  Slow Start
2.  Congestion Avoidance
3.  Fast Retransmit
4.  Fast Recovery

Slow start — Like a New Relationship, but With Packets
------------------------------------------------------

You don’t drop your whole life story in the first text, right? You start chill, feel the vibe, build trust, and back off if it gets too much.
**TCP does the same.**

When a new connection kicks off, TCP has _no clue_ how much traffic the network can handle. So it starts small: sends a tiny batch of packets and waits. If things go well? It doubles the number next round.

It tracks this using a variable called **cwnd** (congestion window).

> The **congestion window (cwnd)** is a TCP state variable that limits the amount of data a sender can send into the network before receiving an acknowledgment (ACK). It’s measured in bytes or segments. The size of the cwnd directly controls how much unacknowledged data can be “in flight” at any given time.

![congestion window](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*r9zcMKOMZVWHloC6b_avPw.png)

It starts small, around 1 MSS (Maximum Segment Size), and grows **exponentially** with each successful round-trip.

But hey, just like in dating, you can’t keep accelerating forever. Sooner or later, you hit a limit, either the **ssthresh** (slow start threshold) or actual network congestion.

Congestion Avoidance
--------------------

After reaching **ssthresh** or hitting congestion, TCP enters into congestion avoidance. It employs the AIMD (additive increase multiplicative decrease) principle to tackle congestion.

After reaching threshold, TCP doesn’t ramp the **cwnd** size exponentially, rather, it increases it linearly, by 1, each round trip.

Now, congestion is assumed in two cases :

— Case 1: retransmission due to timeout
If sender is hit with timeout, then TCP assumes serious congestion, so TCP cuts down the **ssthresh** to **cwnd** / 2 and then set **cwnd** to 1, essentially starting from slow start phase again.

— Case 2 : retransmission due to duplicate acknowledgements
If Sender receives duplicate acknowledgements, it figures out there is a packet loss and tries to re-transmit it immediately. This is what we call fast re-transmit.

Fast Retransmit
---------------

To deal with packet loss, TCP uses **duplicate acknowledgements** to detect if a packet has been lost.

*   If a sender receives **3 duplicate ACKs**, TCP assumes packet loss and immediately retransmits the lost packet.
*   TCP doesn’t wait for timeouts to confirm packet loss, it retransmits lost packet ASAP. This is why its called fast retransmission

Fast Recovery
-------------

Along with Fast retransmit, TCP also employs fast recovery to control presumed congestion.

Once the packet is retransmitted, TCP doesn’t immediately drop the **cwnd** to 1. Instead, it adjusts **ssthresh** and keeps sending new packets cautiously.

TCP cuts the **cwnd** by half, and then continues additive increase, essentially entering **Congestion avoidance**.

![captionless image](https://miro.medium.com/v2/resize:fit:1200/format:webp/1*lRP9n0iorHan_3QbKpKNHw.png)

Legacy to Modern: How TCP Congestion control Got Smarter
--------------------------------------------------------

### TCP Tahoe

Named after Lake Tahoe in USA, this was first protocol to introduce congestion control

```
TCP Tahoe = Slow start + AIMD + Fast retransmit
```

After detecting congestion (like a packet loss), TCP Tahoe drops the **cwnd** all the way down to 1 and restarts with slow start. This aggressive reset slows things down and makes it less efficient, especially on high-speed networks.

![captionless image](https://miro.medium.com/v2/resize:fit:702/format:webp/1*gupACobSvOXMIJL4XmFbwA.png)

### TCP Reno

Reno builds on TCP Tahoe by adding **Fast Recovery** to avoid restarting from scratch after packet loss.

```
TCP Reno = TCP Tahoe + fast recovery
```

When it gets 3 duplicate ACKs (a sign of packet loss), it:

*   Retransmits the lost packet immediately (Fast Retransmit)
*   Cuts **cwnd** by half instead of dropping to 1
*   Skips slow start and enters **Congestion Avoidance** directly

![captionless image](https://miro.medium.com/v2/resize:fit:1390/format:webp/0*xfT0DCfmnRnLIz4r.png)

### BBR ( Bottleneck Bandwith and RTT ) TCP

While older algorithms like Tahoe and Reno react to packet loss, BBR does not rely on packet loss for congestion detection. Instead, it tries to model the actual network path by measuring two things:

*   **Max bandwidth** it can push through without buffering.
*   **Minimum RTT** it observes when the queue is empty.

It then sends data _just fast enough_ to fill the pipe, not flood it. So it avoids **bufferbloat**, keeps latency low, and maintains high throughput.

> Why it matters:
> 
> BBR works great for modern high-speed networks where packet loss isn’t the best signal for congestion. It delivers smoother, faster transfers without the classic slow-fast flow.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*03uCIV1o2299i23YbDmIZQ.png)

Wrapping It Up
--------------

So yeah, if your internet suddenly feels like it’s running on vibes instead of speed, it’s not just your WiFi being moody. It’s TCP doing its thing, constantly adapting to network conditions, avoiding meltdowns, and trying to find the sweet spot between speed and stability.

From old-school Tahoe to the smarter BBR, congestion control has come a long way. The internet isn’t just a bunch of cables and routers, it’s a whole dance of signals, guesses, and recovery strategies happening behind the scenes.

Next time your download slows down for a sec, maybe don’t cuss out your WiFi . Just know TCP’s out there, lowkey saving the internet .

_Thank You for Reading this far._

Connect with me:

*   [X](http://x.com/skshmgpt)
*   [Bluesky](http://skshmgpt.bsky.social)
