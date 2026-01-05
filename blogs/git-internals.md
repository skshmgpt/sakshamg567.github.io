## Git is a Database

![banner](/git-blog-banner.webp)

You've probably typed `git add`, `git commit` and `git push` a hundred times. 
But have you ever stopped to wonder what actually happens when you hit Enter?

If you have - great.
If not, no worries. That's exactly what we are going to explore in this blog.

Let me start by establishing a key idea upfront: 

> **Git is a Database**

We'll come back to this, but this is the core idea around which everything revolves. 

At the storage level, git is an object database, every file, every folder, everything, becomes an object. 
However, at the version control level, where we operate, the smallest logical unit is a `commit`. 

So, what are these objects ?

# PART 1 : The Theory
## Git Objects
Objects are the fundamental storage unit of git. We mainly have blob (file content), tree (directory) and commit (snapshot of the staging area (index)). Understanding these will help you grasp the working model of how git manages and tracks commits. 

### What is a blob?
Blob is just your raw file content, zlib compressed. To identify this blob, we simply take a SHA-1 hash of its content, this becomes a unique identifier of a particular version of a file, changing the content changes the hash. When we do `git add <filename>`, it creates a new blob for that file. 

### What is a tree?
A `tree` object  represents a directory. It maps filenames to object hashes, and can reference:
- blobs(files)
- other trees (subdirectories)
This allows git to represent an entire directory hierarchy using recursive structure. 

When you run `git add dir/`, Git:
1. Creates blobs for individual files
2. Creates tree objects that references these blobs
3. Recursively builds higher-level trees for subdirectories
Each tree is immutable and identified by its hash

Let's look at a tree object. 
![tree](/git-tree.svg)
see, it represents the root directory, containing files, and other directories. 

#### What is a Commit?
A `commit` is a snapshot of the staging area (index), at the moment of executing `git commit` . 

A `commit` object contains : 
- a reference to a root tree (the snapshot)
- one or more parent commit references
- metadata (author, timestamp)
- a commit message

In other words, a commit does not store files directly. It stores a pointer to a tree, which stores the pointers to the files and subtrees. 


Because of this, we can completely construct all the files from a single commit hash, given the `.git` folder is intact.

![commit](/git-1.svg)

`commits` form a directed acyclic graph (DAG), where each commit references one or more parent commits. In the common case, this graph is linear.

![commit](/git-commit.svg)
Each circle in this diagram is a commit, after `git init`, and doing `git add` and `git commit`, our first commit is created, i.e. `a1b2c3d` . 

From the diagram, we can also see, that `main` or `master`, is simply a reference to a commit. Branches in Git do not contain commits, they just point to them. This is why branching is so cheap; because we just need to create a new reference. 

Another small, but important concept, `HEAD`.

`HEAD` usually points to a branch reference, which in turn points to a commit.  
In a detached HEAD state, `HEAD` points directly to a commit.
`HEAD` indicates the current position of our repository. 

Each time we create a commit on a branch, the branch reference  moves forward, which updates the `HEAD` automatically since it refers to the reference.


most of the theory is done, but theory can only take us so far, so, lets fire up the terminal and type some commands. 

<hr>

# PART 2 : Git in Action

 Aight, the theory's over, now, lemme actually make a new project and show how each git command translates.

i'm creating a barebones go project - 

```bash
~/dev/test
❯ go mod init example
go: creating new go.mod: module example

~/dev/test via 🐹 v1.25.5
❯ touch main.go
```

Let's also initialise a fresh git repository - 

```bash
~/dev/test via 🐹 v1.25.5
❯ git init
Initialized empty Git repository in /Users/sakshamgupta/dev/test/.git/
```

now, what git init does is, it creates a .git folder, this is the source of truth of your repository, it contains each and everything you ask git to track. 

Let's take a look at the structure of `.git` folder - 

```bash
❯ tree .git
.git
├── HEAD
├── config
├── description
├── hooks
│   ├── applypatch-msg.sample
│   ├── commit-msg.sample
│   ├── fsmonitor-watchman.sample
│   ├── post-update.sample
│   ├── pre-applypatch.sample
│   ├── pre-commit.sample
│   ├── pre-merge-commit.sample
│   ├── pre-push.sample
│   ├── pre-rebase.sample
│   ├── pre-receive.sample
│   ├── prepare-commit-msg.sample
│   ├── push-to-checkout.sample
│   └── update.sample
├── info
│   └── exclude
├── objects
│   ├── info
│   └── pack
└── refs
    ├── heads
    └── tags
```

too much to digest at once, but don't worry, i will walkthrough things gradually.

`.git` dir has mainly 4 important things - 

- HEAD 
- config
- objects
- refs

Let's create a commit - 
```bash
❯ git commit -m "test"
[main (root-commit) be5e126] test
 2 files changed, 10 insertions(+)
 create mode 100644 go.mod
 create mode 100644 main.go
```

now, let's look at the `.git` folder to see, if anything changed

```bash
❯ tree .git
.git
├── COMMIT_EDITMSG
├── HEAD
├── config
├── description
├── hooks
│   ├── applypatch-msg.sample
│   ├── commit-msg.sample
│   ├── fsmonitor-watchman.sample
│   ├── post-update.sample
│   ├── pre-applypatch.sample
│   ├── pre-commit.sample
│   ├── pre-merge-commit.sample
│   ├── pre-push.sample
│   ├── pre-rebase.sample
│   ├── pre-receive.sample
│   ├── prepare-commit-msg.sample
│   ├── push-to-checkout.sample
│   └── update.sample
├── index
├── info
│   └── exclude
├── logs
│   ├── HEAD
│   └── refs
│       └── heads
│           └── main
├── objects
│   ├── 37
│   │   └── 4046752f99ce801580aa6b2a891263ed548145
│   ├── be
│   │   └── 5e126f8f7b57e14073f028f8e8f8679616fe88
│   ├── c0
│   │   └── 4811917f0218be3c10c48c5d26f129a82812f2
│   ├── d3
│   │   └── cb48db14c92ca44211414f1929d6aee95f7eb8
│   ├── info
│   └── pack
└── refs
    ├── heads
    │   └── main
    └── tags
```

so, we can see a new entry under refs/heads, index and 4 new objects, and from our basic intuition, we can guess, that, 2 objects are our two files `go.mod`, `main.go`, one is a `tree` and one is a commit. 

Let's confirm this : 

```bash
❯ git cat-file -p be5e126f8f7b57e14073f028f8e8f8679616fe88

tree 374046752f99ce801580aa6b2a891263ed548145
author Saksham Gupta <saksham060306@gmail.com> 1767541512 +0530
committer Saksham Gupta <saksham060306@gmail.com> 1767541512 +0530

test
```

and, lets see the `tree` also : 

```bash
❯ git cat-file -p 374046752f99ce801580aa6b2a891263ed548145
100644 blob d3cb48db14c92ca44211414f1929d6aee95f7eb8	go.mod
100644 blob c04811917f0218be3c10c48c5d26f129a82812f2	main.go
```

let's create a new commit, adding a new hello.txt file : 

```bash
❯ git cat-file -p b4f2affdb577ac5a1bdfb7f7ee74de1c143d8c31

tree 455fae52133ca350a5c7a695610afdfefbb88436
parent be5e126f8f7b57e14073f028f8e8f8679616fe88
author Saksham Gupta <saksham060306@gmail.com> 1767542639 +0530
committer Saksham Gupta <saksham060306@gmail.com> 1767542639 +0530

add hello.txt

test on  main via 🐹 v1.25.5
❯ git cat-file -p 455fae52133ca350a5c7a695610afdfefbb88436
100644 blob d3cb48db14c92ca44211414f1929d6aee95f7eb8	go.mod
100644 blob 3b18e512dba79e4c8300dd08aeb37f8e728b8dad	hello.txt
100644 blob c04811917f0218be3c10c48c5d26f129a82812f2	main.go
```

we can see, this new commit, has a parent commit, which refers to previous commit, and the tree refers to the same file commits for `go.mod` and `main.go`, as they were unchanged. so, we just need a tree-hash to restore all the file for a particular commit. 

### The `index` file

We’ve seen that a `commit` is a snapshot of the staging area — but what exactly _is_ this staging area, and why does Git need it?

The **index** (also called the _staging area_) represents the **exact contents of the next commit**. It is Git’s proposal for what the repository should look like when the next commit is created.

Git never commits directly from the working directory. Instead, it commits **from the index**.

Internally, the index is a binary file stored at `.git/index`. It maps **file paths to blob hashes**, along with metadata such as file mode and timestamps. The index does not store file contents itself — it only references objects that already exist in Git’s object database.

Because of this design, the index acts as a precise and explicit boundary between:

- what exists in the working directory, and
- what will be recorded in history


At its core, git is actually pretty simple, and which is why its hard to design such a thing in the first place. Heil Linus 

That's a wrap for now, i have skipped over a few small things like packfiles, reflogs, diffs, garbage collection etc. , you can gippity them easily.
