classes = []
classes << "GCopyrightCollection.js"
classes << "GDirections.js"
classes << "GDraggableObject.js"
classes << "GEvent.js"
classes << "GGeoXml.js"
classes << "GGroundOverlay.js"
classes << "GInfoWindow.js"
classes << "GMap2.js"
classes << "GMapType.js"
classes << "GMarker.js"
classes << "GPolygon.js"
classes << "GPolyline.js"
classes << "GScreenOverlay.js"
classes << "GStreetviewOverlay.js"
classes << "GStreetviewPanorama.js"
classes << "GTileLayer.js"
classes << "GTrafficOverlay.js"

all_types = []
puts "var EVENT_SINGNATUR = {"
classes.each_with_index do |file,fileindex|
	lines = File.readlines(file)
	puts "\t'#{File.basename(file,'.js')}':{"#class begin
	lines.each_with_index do |line,idx|
		a = line.scan(/^(.*)\((.*)\)/).first
		event = a.shift
		b = a.first.split(",")
	
		print "\t\t'#{event}'\n\t\t\t:['#{event}',["		
		b.each_with_index do |x,i|
			name,type = x.split(":")
			all_types << type
			print "'#{type}'"
			print "," if i != b.size-1
		end
		print "]]"
		print "," if idx != lines.size-1
		print "\n"
	end
	print "\t}"
	print "," if fileindex != classes.size-1
	print "\n"
end
print "};//",all_types.uniq.join(",")