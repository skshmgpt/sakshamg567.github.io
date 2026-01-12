## Redis Internals: Understanding It by Rebuilding It


When it comes to caching, you have probably heard about Redis and/or Memcached. But, have you ever wondered about the internal working of these, cause that’s what I deep dived into, and gonna take you with me.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*busIGjQ4ZBQ2Rcc5WnZOAg.png)

> Redis stands for REmote DIctionary Server, technically a key-value store over network. Over the years, Redis has evolved a lot more than just simple key-value storage, and we are going to see that in a bit.

### Why redis?, can’t we just use a normal database

Technically, we can, but let’s go a bit deeper into hardware. A computer has multiple types of storage: CPU cache (L1, L2, L3), primary memory (RAM), and secondary memory (SSD, HDD). Now, CPU caches are crazy fast, L1 being the fastest, followed by L2 and L3, but they are for internal use. The second-best thing we have access to is RAM. RAM access is multiple orders of magnitude faster than SSD or HDD. A normal DB stores data on your drive, which is great for regular use, but if we want fast access, it is not the best option.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*QBbKAZszRzzBjVdec-yhcw.png)

Redis stores data in RAM, providing faster access. Other reasons being, Redis is written in C (automatically goes brrr), its event loop architecture, and lastly, its single-threaded nature, maximizing CPU cache hits, no scheduling, no locks, no context switching, just pure performance.

Redis also has many other use cases, like a pub/sub system, queue, distributed locks, geospatial indexing etc. With added persistence, it can also be used as a proper database.

### Redis’ core architecture

Redis works on a **single-threaded model**, meaning only one thread handles every operation, parsing, executing, returning, storing, accessing, appending to a file, etc. This allows Redis to remain simple, as it removes synchronization b/w threads, locking to access shared data, scheduling etc.

Then, how does it offer concurrency?, Redis uses something called event loop architecture. Essentially, we can serve multiple clients sequentially, so fast that it feels parallel. It checks whenever a socket is ready for read/ write via epoll (Linux), kqueue(macOS), or select, and processes whenever a client is ready. So, directly leveraging the operating system’s i/o multiplexing, Redis remains super fast and concurrent.

Let’s write our own Redis from scratch :)
-----------------------------------------

### Communication —

The first step is to set up client and server communication.

Redis works on raw TCP sockets (or UDS if in a UNIX environment), cause TCP is super fast, reliable, thus perfect for our job. Let’s start by creating a TCP Server.

```
main(){
  listener = Listen(type:tcp,port:8080)
  while(true){
    - accept new connections
    - start reading from the connections
  }
}
```

Next step, the language of Redis, RESP (redis serialization protocol). To make operations easier, we need our server and client to talk in a common language. Now, to make our Redis compatible with any Redis client, I’ll go with RESP, you are, however, free to write your own protocol too, just some extra headache of writing a client also.

### Understanding RESP

We mainly have 5 types of values in RESP,

```
 SIMPLE_STRING = '+'
 SIMPLE_ERROR  = '-'
 INTEGERS      = ':'
 BULK_STRING   = '$'
 ARRAY         = '*'
```

Let’s take a simple command

```
❯ redis-cli
127.0.0.1:6379> SET name saksham
```

Here’s the RESP representation of it

```
*3\r\n$3\r\nset\r\n$5\r\nname\r\n$5\r\nsaksham
```![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*uxmNzMfm6-UpF6Cm3DicXQ.png)

simplifying,

```
*3
$3 
set 
$5 
name
$5 
saksham
```

so, `map[name]=saksham`

We need to write a serializer and a deserializer for resp protocol, so we can communicate properly with the client.

> serializing is the process of converting an in-memory object (like python dict, go struct, js object etc.), to a format, that can be stored, or transmitted, like json, XML, etc. deserilazation is the reverse of serialization, converting transmitted format back to in-memory object.

As we have seen the RESP already, let’s start with a deserializer.

We mainly need deserializing methods for arrays and bulk strings, as most commands are serialized as them.

Firstly, we read the first byte to find the type of whole object; after that, we process them individually.

For arrays and bulk strings, we read the next byte to find the size or len.

Then, we process each object of the array individually in the same way as a whole.

For bulk, we just read till we reach the end, and obtain the bulk string.

```
Value:{
  Typ:array
  Str: 
  Num:0 
  Bulk: 
  Array:[    {Typ:bulk Str: Num:0 Bulk:set Array:[]}
    {Typ:bulk Str: Num:0 Bulk:name Array:[]}
    {Typ:bulk Str: Num:0 Bulk:saksham Array:[]}
  ]
}
```

We should roughly get a similar object. Now, it is so easy to work with this, as it is native to the language.

Now, as we have a rough idea of the in-memory object, let’s write the serializer also.

Same idea, just in reverse, we will iterate over this object, and serialize according to its type; we can have different methods for different types. We need to read the type, length, value (number/string/array), and convert that to a string.

### Handling the commands

Let's start with simple SET/GET. We will use a simple HashMap to store our k:v pairs.

```
kvstore : map[string]string
function set(args[]: key and value) {
  kvstore[key] = value
}
function get(args[]: key) value {
  return kvstore[key]
}
```

Now, after deserializing, we can call these functions according to the intended method.

> An important point we need to discuss here is concurrency. Let me ask you a question: how do you handle multiple clients together, and prevent them from modifying the values at the same time (aka race condition)?
> 
> The answer varies depending on your approach to concurrency. As discussed earlier, Redis relies on the operating system’s i/o multiplexing, and, being single-threaded, processes only one request at a time. The approach I used while building mine was to use Go’s inbuilt goroutines (~ lightweight threads) and blocking channels, with a main goroutine that reads from this channel. Now, whenever a client sends a command, the channel gets blocked till someone reads from it, and the main goroutine reads the command, processes it, returns the result, then reads again. Using goroutines + channels mimics Redis’ event loop behavior conceptually, though under the hood it’s Go’s scheduler managing them, not the OS event loop. Could’ve used locks too, but this felt cleaner.
> 
> Your implementation totally depends on you, so, time for a deep dive into concurrency, understand tradeoffs in different approaches :), find what constructs your language of choice offers for concurrency, FAFO.

In a similar fashion, we can introduce more commands like hset, get, hgetall, which are just a map of key, map[k:v] pairs.

### Next step, persistence

Well, apart from in-memory cache, Redis can double up as a database too. Redis offers two ways of persistence, [RDB](https://redis.io/docs/latest/operate/oss_and_stack/management/persistence/#snapshotting) and [AOF](https://redis.io/docs/latest/operate/oss_and_stack/management/persistence/#append-only-file). RDB — Redis database is just a point-in-time snapshot of the whole database, taken periodically. its faster, cheaper, but has a problem with data loss. For write-heavy workloads, if the server dies between two snapshots, all the data gets lost. To tackle this, we can use an append-only file. This is a clever way to persist data. In this, we write all the write commands directly to a file, in RESP format. So, for every write req, we append that command to a file, and, on server restart, we just read from that file, execute commands one by one, to bring the database to a consistent state.

Pretty simple, right? Just write the parsed req to a file.

Well, if you implemented all the things described till now, you will end up with a pretty decent functional Redis clone.

### Time to level up

Let’s start with log rewrites, lemme ask you, if we keep appending commands to our file, what will happen eventually? Well, suppose I perform a set operation on the same key, 2000 times, naively, your Redis will write it 2000 times, execute it 2000 times on restart :). What a waste of resources. The solution, just execute the last one, and you will get the same result.

Using this idea, Redis has a method called `BGREWRITEAOF`which does what I just described (roughly). To implement this, we need to first create a copy of the database. Now, you can either create a deep copy or just share the memory via `fork()` as Redis does. Next, create a temporary aof file, and iterate through this snapshot and append minimal commands needed to bring db to this state. One cool thing you can do, is, as this will run while redis is running, buffer new commands, and append them to your temp file after iterating through the snapshot, so consistency is maintained. Run this rewrite method every few minutes or seconds.

### Transactions

A transaction is just a set of commands that count together as a single operation. Maybe you’re familiar with it if you’ve taken a DBMS class. The transaction either runs fully or doesn’t run at all. So, database consistency is guaranteed before and after it.

Implementing transactions is also quite simple. We need to track when a client is in transaction mode, using `MULTI`, and when it is, we just queue every request till `EXEC` is called, on which we just execute the queued commands one by one. Here, we can control, if a transaction fails, we will not write to aof, so Redis remains eventually consistent, not fully ACID compliant.

### Pubsubs

Redis also offers pub/sub; a client can subscribe to multiple channels, and if any other client publishes a message to the channel, all the subscribers get it, kind of like an interconnected group chat. To implement a pub/sub system, we need to track a few things: firstly, a mapping of topics to subscribers, and topics a client is subscribed to. On `SUBSCRIBE`, we just take the topic name and map the client to the topic. On `PUBLISH`, we will loop through all the subscribers of a topic and send them the message.

![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*DATMvOEYxR1wIZim5XNIQQ.png)

Pretty simple and elegant, right? Think of where this can be used in your next project :)

Now, my implementation was till this far only; you can surely go beyond this, add key expiration (TTL or LRU), more data structures like hyperloglog (pretty interesting), sorted sets, pipelines, and more (look into Redis documentation).

### Stats (for nerds)

Let’s look at some benchmarks, comparing my implementation v/s the real thing —

```
---- REDIS ----
Summary (GET):
  throughput summary: 61919.50 requests per second
Summary (SET):
  throughput summary: 63613.23 requests per second
---- MY-REDIS ----
Summary (GET) :
  throughput summary: 49776.01 requests per second
Summary (SET) :
  throughput summary: 48402.71 requests per second
- Tested for 100k req with 1000 concurrent connections
```

Pretty cool ig, considering the added scheduling overhead, and other stuff. Raw event loop performance is still unbeatable.

If you made it till here, first of all, thank you for reading the whole blog. Do let me know whether you liked it. Check out my implementation here — [**getsetgo**](https://github.com/sakshamg567/getsetgo) **.**
