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
name = []
args = []
for file in classes
	File.readlines(file).each do |line|
		a = line.scan(/^(.*)\((.*)\)/).first
		name << a.shift
		for x in a
			args << x.split(":").last
		end
	end
end
puts name.uniq
puts args.uniq