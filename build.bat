copy g2b.o.js g2b.o.js.bak
rem cl /EP g2b.o.js>g2b.js
cpp -P -C g2b.o.js>g2b.js
java -jar yuicompressor.jar --charset utf8 g2b.js -o g2b-min.js
