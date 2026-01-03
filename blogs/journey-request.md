Journey of a request — Beyond the Protocols
===========================================
![captionless image](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*wD3Bqg85fgg6IomjVtnRrA.png)

> Requests — we deal with them every day. Every click on the internet is a request, even this blog you opened, started with a request.
> 
> But, have you ever thought about what went behind the scenes for this data to get to you? . If not, then no worries, that’s exactly what we are gonna do today :)

Let’s start from making a simple `GET` request

```
curl -v https://sakshamdev.me
```

the result,

```
* Host sakshamdev.me:443 was resolved.
* IPv6: 64:ff9b::b9c7:6c99, 64:ff9b::b9c7:6e99, 64:ff9b::b9c7:6d99, 64:ff9b::b9c7:6f99
* IPv4: 185.199.109.153, 185.199.111.153, 185.199.108.153, 185.199.110.153
*   Trying [64:ff9b::b9c7:6c99]:443...
* Connected to sakshamdev.me (64:ff9b::b9c7:6c99) port 443
* ALPN: curl offers h2,http/1.1
* TLSv1.3 (OUT), TLS handshake, Client hello (1):
*  CAfile: /etc/ssl/certs/ca-certificates.crt
*  CApath: /etc/ssl/certs
* TLSv1.3 (IN), TLS handshake, Server hello (2):
* TLSv1.3 (IN), TLS handshake, Encrypted Extensions (8):
* TLSv1.3 (IN), TLS handshake, Certificate (11):
* TLSv1.3 (IN), TLS handshake, CERT verify (15):
* TLSv1.3 (IN), TLS handshake, Finished (20):
* TLSv1.3 (OUT), TLS change cipher, Change cipher spec (1):
* TLSv1.3 (OUT), TLS handshake, Finished (20):
* SSL connection using TLSv1.3 / TLS_AES_128_GCM_SHA256 / X25519 / RSASSA-PSS
* ALPN: server accepted h2
* Server certificate:
*  subject: CN=sakshamdev.me
*  start date: Sep  7 09:06:08 2025 GMT
*  expire date: Dec  6 09:06:07 2025 GMT
*  subjectAltName: host "sakshamdev.me" matched cert's "sakshamdev.me"
*  issuer: C=US; O=Let's Encrypt; CN=R13
*  SSL certificate verify ok.
*   Certificate level 0: Public key type RSA (2048/112 Bits/secBits), signed using sha256WithRSAEncryption
*   Certificate level 1: Public key type RSA (2048/112 Bits/secBits), signed using sha256WithRSAEncryption
*   Certificate level 2: Public key type RSA (4096/152 Bits/secBits), signed using sha256WithRSAEncryption
* TLSv1.3 (IN), TLS handshake, Newsession Ticket (4):
* using HTTP/2
* [HTTP/2] [1] OPENED stream for https://sakshamdev.me/
* [HTTP/2] [1] [:method: GET]
* [HTTP/2] [1] [:scheme: https]
* [HTTP/2] [1] [:authority: sakshamdev.me]
* [HTTP/2] [1] [:path: /]
* [HTTP/2] [1] [user-agent: curl/8.5.0]
* [HTTP/2] [1] [accept: */*]
> GET / HTTP/2
> Host: sakshamdev.me
> User-Agent: curl/8.5.0
> Accept: */*
>
< HTTP/2 200
< server: GitHub.com
< content-type: text/html; charset=utf-8
< last-modified: Fri, 12 Sep 2025 16:34:31 GMT
< access-control-allow-origin: *
< strict-transport-security: max-age=31556952
< etag: "68c44b97-26a"
< expires: Sat, 13 Sep 2025 18:46:38 GMT
< cache-control: max-age=600
< x-proxy-cache: MISS
< x-github-request-id: EA88:39B2E3:2E644:35B23:68C5B9B6
< accept-ranges: bytes
< age: 0
< date: Sat, 13 Sep 2025 18:36:38 GMT
< via: 1.1 varnish
< x-served-by: cache-bom-vanm7210049-BOM
< x-cache: MISS
< x-cache-hits: 0
< x-timer: S1757788598.236869,VS0,VE309
< vary: Accept-Encoding
< x-fastly-request-id: 42e5ed3a8696c22e4d728cc7fb66851d4cd7cae7
< content-length: 618
<
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Saksham</title>
  <script type="module" crossorigin src="/assets/index-DRfjnX_-.js"></script>
  <link rel="stylesheet" crossorigin href="/assets/index-CZDunyG3.css">
</head>
<body class="bg-black">
  <div id="root"></div>
</body>
* Connection #0 to host sakshamdev.me left intact
</html>
```

The output looks overwhelming, but at a high level, it boils down to just a few steps:

1.  DNS Resolution
2.  Connection Handshake
3.  TLS Handshake
4.  Sending the request
5.  Getting the response

### DNS Resolution

For sending someone something, we need their address, in same way, over the internet, we need IP address to identify a device. DNS server takes the domain `sakshamdev.me` and translates it to an IPv4/v6 address.

### Connection Handshake

HTTP is a userspace protocol, actual connections are handled by TCP/UDP, which are kernel space protocols. TCP ensures,

*   everything works smoothly
*   bytes arrive in order
*   no packet gets lost

TCP Connection creation usually looks like this,

1.  The client calls`socket()` — a syscall, which basically creates a tunnel for communication, and returns a file descriptor (an integer), that correspond to that open socket. (interested?, read more of sockets [here](https://en.wikipedia.org/wiki/Network_socket))
2.  Using that fd, it calls `connect()` using the ip address of the destination server.

On a lower level, what happens roughly :

1.  A SYN Packet goes from the kernel to your network card and is sent through the network.
2.  On the destination server, the packet is received by the network card. The (Linux) Kernel maintains two queues, SYN Queue and Accept Queue. The SYN from the client is put in SYN queue, and a SYN-ACK is sent back to the client.
3.  If an ACK is received back, the pkt is put into the accept queue.

This is the whole process of a 3-way TCP Handshake, at the kernel level.

Next step, to accept the connection, our app makes the accept() syscall. It reads the first pkt request from the accept queue, creates a new socket for it, and returns a file descriptor for that socket.

### TLS Handshake

For secure communication, we need encryption. During a TLS Handshake, the client and server verify each other using certificates, establish cryptographic algorithms, and agree on session keys. After the TLS handshake, every pkt is encrypted using the key, and decrypted by the server.

![TLS Hanshake](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*AbS2O_RE256VI7_zGPzL_Q.png)

### Sending the Request

Now, the actual step, sending the GET Req. Data is broken into chunks, and each chunk is encrypted by TLS. Using the socket fd received previously, the client writes the data to the socket, then the kernel makes sure the bytes are written to network card, which gets transmitted over the internet. After all the routing through routers, switches, it finally makes it way to the receiver’s NIC. After TCP/IP Stack validates it, kernel receives the pkt. It gets converted to socket buffer, and gets placed in the socket’s receive queue till read() / recv() is called by the listening app. When recv() is called, the pkt is moved from kernel space to user space, where the app can finally access it. First, we decrypt the request, parse it according to the required protocol (HTTP in our case), decode it, decompress it, deserialize it, and finally extract the actual request : `GET '/'` which gets mapped to a handler. Now, we run the handler, do stuff, and prepare the response, which is the HTML for `sakshamdev.me` in this case.

### Getting the Response

After the server prepares the response, it reruns the whole flow of sending a request, just for the client this time. At the end the client receives the HTML, parses it, extracts the scripts and images, again requests for them, and at the end, a nice portfolio website is rendered, all under 1~2 seconds.

### TLDR;

Every click on the internet triggers a complex chain of events your system first resolves the domain to an IP via DNS, creates a socket with a `socket()` syscall, performs a TCP three-way handshake to establish a reliable link, secures it through a TLS handshake, sends an HTTP request that travels across routers and networks to the server, which processes it, sends back a response, and finally, your browser decrypts, parses, and renders the page all within a fraction of a second.

Next time you make a request, take a moment to realize the decades of engineering behind it.
