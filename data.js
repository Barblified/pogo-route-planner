// Pokéstop data organized by city
const cityData = {
    london: {
        name: "London",
        center: [51.5074, -0.1278],
        stops: [
            { name: "Nelson's Column", lat: 51.5081, lng: -0.1280 },
            { name: "National Gallery", lat: 51.5089, lng: -0.1283 },
            { name: "St Martin-in-the-Fields", lat: 51.5092, lng: -0.1264 },
            { name: "Admiralty Arch", lat: 51.5071, lng: -0.1276 },
            { name: "Horse Guards Parade", lat: 51.5045, lng: -0.1272 },
            { name: "Churchill War Rooms", lat: 51.5020, lng: -0.1293 },
            { name: "Westminster Abbey", lat: 51.4994, lng: -0.1273 },
            { name: "Big Ben", lat: 51.5007, lng: -0.1246 },
            { name: "London Eye", lat: 51.5033, lng: -0.1195 },
            { name: "Waterloo Station", lat: 51.5031, lng: -0.1132 },
            { name: "Southbank Centre", lat: 51.5056, lng: -0.1154 },
            { name: "Somerset House", lat: 51.5110, lng: -0.1170 },
            { name: "Covent Garden Market", lat: 51.5118, lng: -0.1226 },
            { name: "Leicester Square", lat: 51.5103, lng: -0.1301 },
            { name: "Piccadilly Circus", lat: 51.5100, lng: -0.1347 },
            { name: "Buckingham Palace", lat: 51.5014, lng: -0.1419 },
            { name: "St James's Park", lat: 51.5045, lng: -0.1339 },
            { name: "Tower of London", lat: 51.5081, lng: -0.0759 },
            { name: "Tower Bridge", lat: 51.5055, lng: -0.0754 },
            { name: "HMS Belfast", lat: 51.5065, lng: -0.0813 }
        ]
    },
    
    manchester: {
        name: "Manchester",
        center: [53.4808, -2.2426],
        stops: [
            { name: "Manchester Town Hall", lat: 53.4794, lng: -2.2447 },
            { name: "Albert Square", lat: 53.4794, lng: -2.2446 },
            { name: "Manchester Central Library", lat: 53.4781, lng: -2.2446 },
            { name: "St Peter's Square", lat: 53.4776, lng: -2.2441 },
            { name: "John Rylands Library", lat: 53.4805, lng: -2.2496 },
            { name: "Manchester Cathedral", lat: 53.4851, lng: -2.2446 },
            { name: "National Football Museum", lat: 53.4819, lng: -2.2425 },
            { name: "Piccadilly Gardens", lat: 53.4808, lng: -2.2368 },
            { name: "Manchester Art Gallery", lat: 53.4786, lng: -2.2410 },
            { name: "The Printworks", lat: 53.4835, lng: -2.2379 },
            { name: "Arndale Centre", lat: 53.4819, lng: -2.2386 },
            { name: "Manchester Wheel", lat: 53.4761, lng: -2.2520 },
            { name: "Bridgewater Hall", lat: 53.4751, lng: -2.2457 },
            { name: "Deansgate Station", lat: 53.4745, lng: -2.2507 },
            { name: "Spinningfields", lat: 53.4806, lng: -2.2523 },
            { name: "The Lowry", lat: 53.4700, lng: -2.2935 },
            { name: "Old Trafford Cricket", lat: 53.4565, lng: -2.2823 },
            { name: "Science Museum", lat: 53.4767, lng: -2.2550 },
            { name: "Castlefield Bowl", lat: 53.4748, lng: -2.2586 },
            { name: "Manchester Oxford Road", lat: 53.4739, lng: -2.2423 }
        ]
    },
    
    birmingham: {
        name: "Birmingham",
        center: [52.4862, -1.8904],
        stops: [
            { name: "Council House", lat: 52.4797, lng: -1.9026 },
            { name: "Victoria Square", lat: 52.4797, lng: -1.9026 },
            { name: "Birmingham Museum", lat: 52.4797, lng: -1.9039 },
            { name: "Library of Birmingham", lat: 52.4787, lng: -1.9060 },
            { name: "Rep Theatre", lat: 52.4790, lng: -1.9055 },
            { name: "Symphony Hall", lat: 52.4786, lng: -1.9068 },
            { name: "Centenary Square", lat: 52.4785, lng: -1.9059 },
            { name: "Brindleyplace", lat: 52.4768, lng: -1.9118 },
            { name: "Sea Life Centre", lat: 52.4774, lng: -1.9119 },
            { name: "St Philip's Cathedral", lat: 52.4819, lng: -1.8989 },
            { name: "New Street Station", lat: 52.4777, lng: -1.8985 },
            { name: "Bull Ring", lat: 52.4773, lng: -1.8936 },
            { name: "St Martin's Church", lat: 52.4775, lng: -1.8932 },
            { name: "Hippodrome", lat: 52.4774, lng: -1.9022 },
            { name: "Chinatown Gate", lat: 52.4766, lng: -1.9010 },
            { name: "Moor Street Station", lat: 52.4773, lng: -1.8922 },
            { name: "Rotunda", lat: 52.4782, lng: -1.8939 },
            { name: "Selfridges", lat: 52.4773, lng: -1.8936 },
            { name: "Moor Street Clock", lat: 52.4773, lng: -1.8917 },
            { name: "Back to Backs", lat: 52.4754, lng: -1.9010 }
        ]
    },
    
    leeds: {
        name: "Leeds",
        center: [53.8008, -1.5491],
        stops: [
            { name: "Leeds Town Hall", lat: 53.8003, lng: -1.5508 },
            { name: "Victoria Gardens", lat: 53.7996, lng: -1.5488 },
            { name: "City Museum", lat: 53.8001, lng: -1.5487 },
            { name: "Art Gallery", lat: 53.7995, lng: -1.5471 },
            { name: "Millennium Square", lat: 53.7979, lng: -1.5439 },
            { name: "Leeds Playhouse", lat: 53.7977, lng: -1.5417 },
            { name: "Grand Theatre", lat: 53.7990, lng: -1.5458 },
            { name: "City Square", lat: 53.7952, lng: -1.5476 },
            { name: "The Core", lat: 53.7959, lng: -1.5441 },
            { name: "Trinity Leeds", lat: 53.7977, lng: -1.5448 },
            { name: "Leeds Minster", lat: 53.7984, lng: -1.5426 },
            { name: "Corn Exchange", lat: 53.7957, lng: -1.5387 },
            { name: "Leeds Bridge", lat: 53.7952, lng: -1.5382 },
            { name: "Royal Armouries", lat: 53.7917, lng: -1.5318 },
            { name: "Granary Wharf", lat: 53.7937, lng: -1.5515 },
            { name: "Leeds Station", lat: 53.7948, lng: -1.5479 },
            { name: "Kirkgate Market", lat: 53.7967, lng: -1.5395 },
            { name: "Leeds Dock", lat: 53.7919, lng: -1.5323 },
            { name: "Brewery Wharf", lat: 53.7934, lng: -1.5434 },
            { name: "Calls Landing", lat: 53.7946, lng: -1.5394 }
        ]
    },
    
    nottingham: {
        name: "Nottingham",
        center: [52.9548, -1.1581],
        stops: [
            { name: "Nottingham Castle", lat: 52.9505, lng: -1.1555 },
            { name: "Council House", lat: 52.9548, lng: -1.1499 },
            { name: "Old Market Square", lat: 52.9548, lng: -1.1499 },
            { name: "Nottingham Cathedral", lat: 52.9560, lng: -1.1543 },
            { name: "City of Caves", lat: 52.9541, lng: -1.1489 },
            { name: "Ye Olde Trip to Jerusalem", lat: 52.9497, lng: -1.1546 },
            { name: "Nottingham Playhouse", lat: 52.9560, lng: -1.1479 },
            { name: "Theatre Royal", lat: 52.9546, lng: -1.1479 },
            { name: "Cornerhouse", lat: 52.9550, lng: -1.1458 },
            { name: "Nottingham Trent University", lat: 52.9585, lng: -1.1533 },
            { name: "Galleries of Justice", lat: 52.9520, lng: -1.1437 },
            { name: "Nottingham Station", lat: 52.9475, lng: -1.1464 },
            { name: "Broadmarsh Centre", lat: 52.9515, lng: -1.1471 },
            { name: "Lace Market", lat: 52.9534, lng: -1.1425 },
            { name: "St Mary's Church", lat: 52.9531, lng: -1.1431 },
            { name: "Sneinton Market", lat: 52.9541, lng: -1.1360 },
            { name: "Victoria Centre", lat: 52.9576, lng: -1.1468 },
            { name: "Intu Broadmarsh", lat: 52.9515, lng: -1.1467 },
            { name: "Nottingham Contemporary", lat: 52.9562, lng: -1.1563 },
            { name: "Canal House", lat: 52.9500, lng: -1.1482 }
        ]
    },
    
    york: {
        name: "York",
        center: [53.9591, -1.0815],
        stops: [
            { name: "York Minster", lat: 53.9620, lng: -1.0819 },
            { name: "Shambles", lat: 53.9590, lng: -1.0799 },
            { name: "Clifford's Tower", lat: 53.9556, lng: -1.0764 },
            { name: "York Castle Museum", lat: 53.9555, lng: -1.0769 },
            { name: "National Railway Museum", lat: 53.9618, lng: -1.0989 },
            { name: "York City Walls", lat: 53.9617, lng: -1.0852 },
            { name: "Jorvik Viking Centre", lat: 53.9581, lng: -1.0788 },
            { name: "York Art Gallery", lat: 53.9615, lng: -1.0865 },
            { name: "St Mary's Abbey", lat: 53.9622, lng: -1.0887 },
            { name: "Museum Gardens", lat: 53.9611, lng: -1.0889 },
            { name: "Multangular Tower", lat: 53.9613, lng: -1.0891 },
            { name: "Merchant Adventurers Hall", lat: 53.9575, lng: -1.0771 },
            { name: "York Dungeon", lat: 53.9589, lng: -1.0806 },
            { name: "Grand Opera House", lat: 53.9584, lng: -1.0840 },
            { name: "York Station", lat: 53.9586, lng: -1.0930 },
            { name: "Ouse Bridge", lat: 53.9579, lng: -1.0840 },
            { name: "All Saints Church", lat: 53.9596, lng: -1.0786 },
            { name: "Holy Trinity Church", lat: 53.9592, lng: -1.0806 },
            { name: "York Explore Library", lat: 53.9606, lng: -1.0857 },
            { name: "Mansion House", lat: 53.9594, lng: -1.0821 }
        ]
    },
    
    glasgow: {
        name: "Glasgow",
        center: [55.8642, -4.2518],
        stops: [
            { name: "George Square", lat: 55.8609, lng: -4.2514 },
            { name: "Glasgow City Chambers", lat: 55.8609, lng: -4.2488 },
            { name: "Gallery of Modern Art", lat: 55.8597, lng: -4.2511 },
            { name: "Glasgow Cathedral", lat: 55.8629, lng: -4.2334 },
            { name: "Kelvingrove Art Gallery", lat: 55.8686, lng: -4.2893 },
            { name: "Riverside Museum", lat: 55.8706, lng: -4.3115 },
            { name: "Glasgow Science Centre", lat: 55.8594, lng: -4.2950 },
            { name: "Buchanan Street", lat: 55.8605, lng: -4.2540 },
            { name: "Glasgow Central Station", lat: 55.8597, lng: -4.2577 },
            { name: "Royal Concert Hall", lat: 55.8641, lng: -4.2562 },
            { name: "Theatre Royal", lat: 55.8649, lng: -4.2607 },
            { name: "Glasgow Necropolis", lat: 55.8643, lng: -4.2313 },
            { name: "People's Palace", lat: 55.8506, lng: -4.2350 },
            { name: "St Mungo Museum", lat: 55.8633, lng: -4.2339 },
            { name: "Provand's Lordship", lat: 55.8632, lng: -4.2347 },
            { name: "Tron Theatre", lat: 55.8572, lng: -4.2497 },
            { name: "Merchant City", lat: 55.8589, lng: -4.2453 },
            { name: "Glasgow Green", lat: 55.8489, lng: -4.2377 },
            { name: "Barras Market", lat: 55.8549, lng: -4.2333 },
            { name: "Duke of Wellington Statue", lat: 55.8597, lng: -4.2511 }
        ]
    },
    
    liverpool: {
        name: "Liverpool",
        center: [53.4084, -2.9916],
        stops: [
            { name: "Albert Dock", lat: 53.3983, lng: -2.9932 },
            { name: "Liverpool Cathedral", lat: 53.3976, lng: -2.9737 },
            { name: "Metropolitan Cathedral", lat: 53.4046, lng: -2.9682 },
            { name: "St George's Hall", lat: 53.4088, lng: -2.9786 },
            { name: "Liverpool ONE", lat: 53.4024, lng: -2.9889 },
            { name: "The Beatles Statue", lat: 53.4074, lng: -2.9885 },
            { name: "Royal Liver Building", lat: 53.4044, lng: -2.9939 },
            { name: "Museum of Liverpool", lat: 53.4014, lng: -2.9953 },
            { name: "Tate Liverpool", lat: 53.3992, lng: -2.9932 },
            { name: "Cavern Club", lat: 53.4074, lng: -2.9876 },
            { name: "Liverpool Central Library", lat: 53.4079, lng: -2.9804 },
            { name: "Walker Art Gallery", lat: 53.4095, lng: -2.9796 },
            { name: "World Museum", lat: 53.4095, lng: -2.9723 },
            { name: "Mathew Street", lat: 53.4074, lng: -2.9873 },
            { name: "Liverpool Lime Street", lat: 53.4078, lng: -2.9776 },
            { name: "Radio City Tower", lat: 53.4045, lng: -2.9809 },
            { name: "Chavasse Park", lat: 53.4023, lng: -2.9893 },
            { name: "Liverpool Town Hall", lat: 53.4070, lng: -2.9935 },
            { name: "Pier Head", lat: 53.4048, lng: -2.9956 },
            { name: "Mersey Ferries Terminal", lat: 53.4049, lng: -2.9950 }
        ]
    },
    
    newcastle: {
        name: "Newcastle",
        center: [54.9783, -1.6178],
        stops: [
            { name: "Grey's Monument", lat: 54.9739, lng: -1.6112 },
            { name: "Tyne Bridge", lat: 54.9686, lng: -1.6054 },
            { name: "Newcastle Castle", lat: 54.9705, lng: -1.6082 },
            { name: "St Nicholas Cathedral", lat: 54.9693, lng: -1.6119 },
            { name: "Quayside", lat: 54.9690, lng: -1.6050 },
            { name: "Millennium Bridge", lat: 54.9696, lng: -1.5984 },
            { name: "BALTIC Centre", lat: 54.9684, lng: -1.5987 },
            { name: "Sage Gateshead", lat: 54.9688, lng: -1.6014 },
            { name: "Life Science Centre", lat: 54.9682, lng: -1.6146 },
            { name: "Discovery Museum", lat: 54.9690, lng: -1.6159 },
            { name: "Laing Art Gallery", lat: 54.9745, lng: -1.6107 },
            { name: "Eldon Square", lat: 54.9757, lng: -1.6153 },
            { name: "Theatre Royal", lat: 54.9735, lng: -1.6115 },
            { name: "Central Station", lat: 54.9684, lng: -1.6172 },
            { name: "Grainger Market", lat: 54.9720, lng: -1.6129 },
            { name: "Blackfriars", lat: 54.9723, lng: -1.6078 },
            { name: "Civic Centre", lat: 54.9803, lng: -1.6177 },
            { name: "Chinatown Arch", lat: 54.9686, lng: -1.6172 },
            { name: "Great North Museum", lat: 54.9820, lng: -1.6107 },
            { name: "Exhibition Park", lat: 54.9858, lng: -1.6094 }
        ]
    },
    
    sheffield: {
        name: "Sheffield",
        center: [53.3811, -1.4701],
        stops: [
            { name: "Sheffield Town Hall", lat: 53.3811, lng: -1.4676 },
            { name: "Peace Gardens", lat: 53.3811, lng: -1.4688 },
            { name: "Winter Garden", lat: 53.3820, lng: -1.4699 },
            { name: "Millennium Gallery", lat: 53.3824, lng: -1.4700 },
            { name: "Sheffield Cathedral", lat: 53.3835, lng: -1.4706 },
            { name: "Sheffield Station", lat: 53.3783, lng: -1.4622 },
            { name: "Crucible Theatre", lat: 53.3817, lng: -1.4706 },
            { name: "Lyceum Theatre", lat: 53.3819, lng: -1.4704 },
            { name: "Orchard Square", lat: 53.3813, lng: -1.4713 },
            { name: "Fargate", lat: 53.3821, lng: -1.4708 },
            { name: "Moor Market", lat: 53.3822, lng: -1.4681 },
            { name: "Sheffield Hallam University", lat: 53.3784, lng: -1.4661 },
            { name: "Kelham Island Museum", lat: 53.3904, lng: -1.4686 },
            { name: "Ponds Forge", lat: 53.3818, lng: -1.4644 },
            { name: "Sheffield Cathedral Tram Stop", lat: 53.3830, lng: -1.4711 },
            { name: "Barkers Pool", lat: 53.3805, lng: -1.4689 },
            { name: "City Hall", lat: 53.3800, lng: -1.4685 },
            { name: "Sheaf Square", lat: 53.3784, lng: -1.4630 },
            { name: "Sheffield Wheel", lat: 53.3778, lng: -1.4618 },
            { name: "St Paul's Tower", lat: 53.3844, lng: -1.4683 }
        ]
    },
    
    bristol: {
        name: "Bristol",
        center: [51.4545, -2.5879],
        stops: [
            { name: "Clifton Suspension Bridge", lat: 51.4554, lng: -2.6274 },
            { name: "SS Great Britain", lat: 51.4489, lng: -2.6097 },
            { name: "Bristol Cathedral", lat: 51.4496, lng: -2.5994 },
            { name: "Cabot Tower", lat: 51.4570, lng: -2.6073 },
            { name: "M Shed Museum", lat: 51.4498, lng: -2.6018 },
            { name: "At-Bristol Science Centre", lat: 51.4511, lng: -2.5987 },
            { name: "Bristol Aquarium", lat: 51.4514, lng: -2.5998 },
            { name: "Arnolfini", lat: 51.4498, lng: -2.5972 },
            { name: "Queen Square", lat: 51.4507, lng: -2.5964 },
            { name: "College Green", lat: 51.4522, lng: -2.6013 },
            { name: "Park Street", lat: 51.4540, lng: -2.6045 },
            { name: "Bristol Museum", lat: 51.4560, lng: -2.6059 },
            { name: "University of Bristol", lat: 51.4590, lng: -2.6036 },
            { name: "Watershed", lat: 51.4497, lng: -2.5973 },
            { name: "Bristol Old Vic", lat: 51.4532, lng: -2.5968 },
            { name: "Christmas Steps", lat: 51.4539, lng: -2.5939 },
            { name: "Temple Meads Station", lat: 51.4490, lng: -2.5817 },
            { name: "Castle Park", lat: 51.4546, lng: -2.5900 },
            { name: "Corn Street", lat: 51.4540, lng: -2.5929 },
            { name: "Harbourside", lat: 51.4500, lng: -2.5990 }
        ]
    },
    
    edinburgh: {
        name: "Edinburgh",
        center: [55.9533, -3.1883],
        stops: [
            { name: "Edinburgh Castle", lat: 55.9486, lng: -3.1999 },
            { name: "Royal Mile", lat: 55.9506, lng: -3.1880 },
            { name: "St Giles Cathedral", lat: 55.9496, lng: -3.1907 },
            { name: "Holyrood Palace", lat: 55.9527, lng: -3.1719 },
            { name: "Scottish Parliament", lat: 55.9520, lng: -3.1747 },
            { name: "Arthur's Seat", lat: 55.9445, lng: -3.1619 },
            { name: "Scott Monument", lat: 55.9527, lng: -3.1935 },
            { name: "Princes Street Gardens", lat: 55.9507, lng: -3.1962 },
            { name: "National Museum of Scotland", lat: 55.9472, lng: -3.1906 },
            { name: "Greyfriars Bobby", lat: 55.9467, lng: -3.1916 },
            { name: "Edinburgh Waverley", lat: 55.9521, lng: -3.1892 },
            { name: "Calton Hill", lat: 55.9552, lng: -3.1819 },
            { name: "National Gallery", lat: 55.9511, lng: -3.1958 },
            { name: "Camera Obscura", lat: 55.9488, lng: -3.1955 },
            { name: "Grassmarket", lat: 55.9475, lng: -3.1972 },
            { name: "Victoria Street", lat: 55.9482, lng: -3.1945 },
            { name: "Dynamic Earth", lat: 55.9508, lng: -3.1730 },
            { name: "St Andrew Square", lat: 55.9547, lng: -3.1918 },
            { name: "Scottish National Portrait Gallery", lat: 55.9554, lng: -3.1941 },
            { name: "Dean Village", lat: 55.9529, lng: -3.2168 }
        ]
    },
    
    leicester: {
        name: "Leicester",
        center: [52.6369, -1.1398],
        stops: [
            { name: "Leicester Cathedral", lat: 52.6358, lng: -1.1381 },
            { name: "Curve Theatre", lat: 52.6364, lng: -1.1357 },
            { name: "Clock Tower", lat: 52.6361, lng: -1.1380 },
            { name: "Town Hall Square", lat: 52.6364, lng: -1.1393 },
            { name: "King Richard III Centre", lat: 52.6356, lng: -1.1383 },
            { name: "Highcross Shopping", lat: 52.6363, lng: -1.1367 },
            { name: "New Walk Museum", lat: 52.6278, lng: -1.1341 },
            { name: "Leicester Guildhall", lat: 52.6358, lng: -1.1399 },
            { name: "Jewry Wall Museum", lat: 52.6370, lng: -1.1419 },
            { name: "St Martin's House", lat: 52.6358, lng: -1.1374 },
            { name: "Leicester Market", lat: 52.6350, lng: -1.1378 },
            { name: "Magazine Gateway", lat: 52.6380, lng: -1.1425 },
            { name: "Leicester Station", lat: 52.6309, lng: -1.1247 },
            { name: "Phoenix Arts Centre", lat: 52.6308, lng: -1.1358 },
            { name: "De Montfort University", lat: 52.6280, lng: -1.1395 },
            { name: "Abbey Park", lat: 52.6465, lng: -1.1363 },
            { name: "Haymarket Theatre", lat: 52.6377, lng: -1.1396 },
            { name: "Granby Street", lat: 52.6342, lng: -1.1357 },
            { name: "Orton Square", lat: 52.6343, lng: -1.1403 },
            { name: "Belgrave Gate", lat: 52.6397, lng: -1.1354 }
        ]
    },
    
    coventry: {
        name: "Coventry",
        center: [52.4068, -1.5197],
        stops: [
            { name: "Coventry Cathedral", lat: 52.4083, lng: -1.5079 },
            { name: "Cathedral Ruins", lat: 52.4084, lng: -1.5082 },
            { name: "Herbert Art Gallery", lat: 52.4080, lng: -1.5088 },
            { name: "Coventry Transport Museum", lat: 52.4075, lng: -1.5124 },
            { name: "Belgrade Theatre", lat: 52.4085, lng: -1.5098 },
            { name: "Broadgate", lat: 52.4082, lng: -1.5108 },
            { name: "Lady Godiva Statue", lat: 52.4081, lng: -1.5103 },
            { name: "Priory Visitor Centre", lat: 52.4083, lng: -1.5066 },
            { name: "Coventry University", lat: 52.4068, lng: -1.5089 },
            { name: "Pool Meadow", lat: 52.4060, lng: -1.5092 },
            { name: "Coventry Station", lat: 52.4009, lng: -1.5207 },
            { name: "Millennium Place", lat: 52.4080, lng: -1.5093 },
            { name: "Old Cathedral Tower", lat: 52.4085, lng: -1.5079 },
            { name: "Holy Trinity Church", lat: 52.4072, lng: -1.5123 },
            { name: "Fargo Village", lat: 52.3999, lng: -1.5175 },
            { name: "Coventry Market", lat: 52.4080, lng: -1.5123 },
            { name: "St Mary's Guildhall", lat: 52.4080, lng: -1.5104 },
            { name: "Warwick Arts Centre", lat: 52.3827, lng: -1.5606 },
            { name: "War Memorial Park", lat: 52.3946, lng: -1.5283 },
            { name: "Drapers Hall", lat: 52.4079, lng: -1.5076 }
        ]
    },
    
    cardiff: {
        name: "Cardiff",
        center: [51.4816, -3.1791],
        stops: [
            { name: "Cardiff Castle", lat: 51.4820, lng: -3.1813 },
            { name: "Principality Stadium", lat: 51.4783, lng: -3.1826 },
            { name: "Cardiff City Hall", lat: 51.4878, lng: -3.1764 },
            { name: "Wales Millennium Centre", lat: 51.4644, lng: -3.1631 },
            { name: "Cardiff Bay Barrage", lat: 51.4556, lng: -3.1654 },
            { name: "Pierhead Building", lat: 51.4640, lng: -3.1619 },
            { name: "Senedd", lat: 51.4638, lng: -3.1621 },
            { name: "St David's Hall", lat: 51.4795, lng: -3.1739 },
            { name: "Cardiff Central Station", lat: 51.4754, lng: -3.1788 },
            { name: "Cardiff Museum", lat: 51.4875, lng: -3.1762 },
            { name: "Bute Park", lat: 51.4851, lng: -3.1903 },
            { name: "Llandaff Cathedral", lat: 51.4994, lng: -3.2168 },
            { name: "St John's Church", lat: 51.4795, lng: -3.1768 },
            { name: "Norwegian Church", lat: 51.4615, lng: -3.1617 },
            { name: "Cardiff Queen Street", lat: 51.4820, lng: -3.1682 },
            { name: "St Mary Street", lat: 51.4792, lng: -3.1789 },
            { name: "Capitol Shopping Centre", lat: 51.4804, lng: -3.1755 },
            { name: "Morgan Arcade", lat: 51.4790, lng: -3.1763 },
            { name: "Royal Arcade", lat: 51.4791, lng: -3.1758 },
            { name: "Roath Park Lake", lat: 51.4947, lng: -3.1690 }
        ]
    },
    
    belfast: {
        name: "Belfast",
        center: [54.5973, -5.9301],
        stops: [
            { name: "Belfast City Hall", lat: 54.5973, lng: -5.9301 },
            { name: "Titanic Belfast", lat: 54.6083, lng: -5.9099 },
            { name: "Ulster Museum", lat: 54.5843, lng: -5.9333 },
            { name: "St Anne's Cathedral", lat: 54.6029, lng: -5.9262 },
            { name: "Grand Opera House", lat: 54.5958, lng: -5.9336 },
            { name: "Victoria Square", lat: 54.5982, lng: -5.9251 },
            { name: "Albert Clock", lat: 54.5988, lng: -5.9223 },
            { name: "Waterfront Hall", lat: 54.5954, lng: -5.9204 },
            { name: "Belfast Castle", lat: 54.6406, lng: -5.9460 },
            { name: "Stormont", lat: 54.6075, lng: -5.8308 },
            { name: "Queen's University", lat: 54.5844, lng: -5.9341 },
            { name: "Botanic Gardens", lat: 54.5827, lng: -5.9333 },
            { name: "Belfast Cathedral", lat: 54.6029, lng: -5.9262 },
            { name: "Linen Hall Library", lat: 54.5972, lng: -5.9311 },
            { name: "SS Nomadic", lat: 54.6078, lng: -5.9096 },
            { name: "Belfast Europa", lat: 54.5959, lng: -5.9351 },
            { name: "Great Victoria Street", lat: 54.5958, lng: -5.9336 },
            { name: "St George's Market", lat: 54.5970, lng: -5.9167 },
            { name: "Custom House Square", lat: 54.6004, lng: -5.9249 },
            { name: "Odyssey Complex", lat: 54.6030, lng: -5.9075 }
        ]
    },
    
    bradford: {
        name: "Bradford",
        center: [53.7960, -1.7594],
        stops: [
            { name: "Bradford City Hall", lat: 53.7960, lng: -1.7510 },
            { name: "Bradford Cathedral", lat: 53.7945, lng: -1.7457 },
            { name: "National Science and Media Museum", lat: 53.7946, lng: -1.7537 },
            { name: "Alhambra Theatre", lat: 53.7965, lng: -1.7507 },
            { name: "St George's Hall", lat: 53.7958, lng: -1.7494 },
            { name: "Bradford Interchange", lat: 53.7928, lng: -1.7501 },
            { name: "Centenary Square", lat: 53.7958, lng: -1.7521 },
            { name: "Bradford College", lat: 53.7941, lng: -1.7461 },
            { name: "Bradford Forster Square", lat: 53.7968, lng: -1.7437 },
            { name: "Little Germany", lat: 53.7950, lng: -1.7420 },
            { name: "Kirkgate Centre", lat: 53.7945, lng: -1.7500 },
            { name: "Broadway Shopping Centre", lat: 53.7928, lng: -1.7501 },
            { name: "Wool Exchange", lat: 53.7944, lng: -1.7482 },
            { name: "City Park Mirror Pool", lat: 53.7957, lng: -1.7534 },
            { name: "Bradford Industrial Museum", lat: 53.7813, lng: -1.7818 },
            { name: "Cartwright Hall", lat: 53.8095, lng: -1.7716 },
            { name: "Lister Park", lat: 53.8095, lng: -1.7711 },
            { name: "Bolling Hall", lat: 53.7817, lng: -1.7403 },
            { name: "Bradford University", lat: 53.7951, lng: -1.7652 },
            { name: "Undercliffe Cemetery", lat: 53.8089, lng: -1.7420 }
        ]
    },
    
    southampton: {
        name: "Southampton",
        center: [50.9097, -1.4044],
        stops: [
            { name: "Bargate", lat: 50.9033, lng: -1.4043 },
            { name: "Southampton Guildhall", lat: 50.9086, lng: -1.4048 },
            { name: "Civic Centre", lat: 50.9086, lng: -1.4048 },
            { name: "Tudor House Museum", lat: 50.9006, lng: -1.4027 },
            { name: "SeaCity Museum", lat: 50.9081, lng: -1.4052 },
            { name: "Southampton Central", lat: 50.9077, lng: -1.4145 },
            { name: "WestQuay Shopping", lat: 50.9043, lng: -1.4098 },
            { name: "Ocean Village", lat: 50.8976, lng: -1.3894 },
            { name: "Town Quay", lat: 50.8986, lng: -1.3959 },
            { name: "God's House Tower", lat: 50.8982, lng: -1.3981 },
            { name: "Wool House", lat: 50.8985, lng: -1.3983 },
            { name: "Medieval Merchant House", lat: 50.8993, lng: -1.3998 },
            { name: "Mayflower Theatre", lat: 50.9065, lng: -1.4081 },
            { name: "Solent Sky Museum", lat: 50.8994, lng: -1.3902 },
            { name: "St Michael's Church", lat: 50.9019, lng: -1.4046 },
            { name: "Above Bar Street", lat: 50.9048, lng: -1.4044 },
            { name: "Southampton City Art Gallery", lat: 50.9080, lng: -1.4063 },
            { name: "Palmerston Park", lat: 50.9180, lng: -1.4085 },
            { name: "Titanic Memorial", lat: 50.8986, lng: -1.3960 },
            { name: "Holyrood Church Ruins", lat: 50.9012, lng: -1.4023 }
        ]
    },
    
    cambridge: {
        name: "Cambridge",
        center: [52.2053, 0.1218],
        stops: [
            { name: "King's College Chapel", lat: 52.2045, lng: 0.1165 },
            { name: "Trinity College", lat: 52.2074, lng: 0.1169 },
            { name: "St John's College", lat: 52.2083, lng: 0.1171 },
            { name: "Great St Mary's Church", lat: 52.2053, lng: 0.1184 },
            { name: "Senate House", lat: 52.2052, lng: 0.1173 },
            { name: "Gonville and Caius", lat: 52.2055, lng: 0.1173 },
            { name: "Mathematical Bridge", lat: 52.2016, lng: 0.1147 },
            { name: "Bridge of Sighs", lat: 52.2086, lng: 0.1174 },
            { name: "Fitzwilliam Museum", lat: 52.1994, lng: 0.1193 },
            { name: "Cambridge Market", lat: 52.2051, lng: 0.1197 },
            { name: "Round Church", lat: 52.2079, lng: 0.1181 },
            { name: "Cambridge Guildhall", lat: 52.2052, lng: 0.1196 },
            { name: "Cambridge Station", lat: 52.1944, lng: 0.1373 },
            { name: "Corpus Clock", lat: 52.2038, lng: 0.1188 },
            { name: "Parker's Piece", lat: 52.2018, lng: 0.1341 },
            { name: "The Backs", lat: 52.2037, lng: 0.1140 },
            { name: "Magdalene College", lat: 52.2106, lng: 0.1189 },
            { name: "Jesus Green", lat: 52.2122, lng: 0.1228 },
            { name: "Cambridge Central Library", lat: 52.2030, lng: 0.1267 },
            { name: "Pembroke College", lat: 52.2017, lng: 0.1174 }
        ]
    },
    
    oxford: {
        name: "Oxford",
        center: [51.7520, -1.2577],
        stops: [
            { name: "Radcliffe Camera", lat: 51.7538, lng: -1.2542 },
            { name: "Bodleian Library", lat: 51.7541, lng: -1.2545 },
            { name: "Christ Church Cathedral", lat: 51.7499, lng: -1.2563 },
            { name: "University Church", lat: 51.7521, lng: -1.2548 },
            { name: "Carfax Tower", lat: 51.7520, lng: -1.2577 },
            { name: "Ashmolean Museum", lat: 51.7554, lng: -1.2604 },
            { name: "Bridge of Sighs", lat: 51.7547, lng: -1.2553 },
            { name: "Sheldonian Theatre", lat: 51.7543, lng: -1.2546 },
            { name: "Balliol College", lat: 51.7545, lng: -1.2580 },
            { name: "Trinity College", lat: 51.7546, lng: -1.2586 },
            { name: "Magdalen College", lat: 51.7515, lng: -1.2476 },
            { name: "Oxford Castle", lat: 51.7513, lng: -1.2624 },
            { name: "Covered Market", lat: 51.7525, lng: -1.2570 },
            { name: "Oxford Town Hall", lat: 51.7517, lng: -1.2584 },
            { name: "Oxford Station", lat: 51.7536, lng: -1.2702 },
            { name: "Merton College", lat: 51.7504, lng: -1.2522 },
            { name: "Exeter College", lat: 51.7540, lng: -1.2574 },
            { name: "New College", lat: 51.7537, lng: -1.2514 },
            { name: "Christ Church Meadow", lat: 51.7481, lng: -1.2528 },
            { name: "Museum of Natural History", lat: 51.7580, lng: -1.2559 }
        ]
    }
};

// Get current city data (defaults to London)
let currentCity = 'london';
let samplePokestops = cityData[currentCity].stops;

// Helper function to calculate distance between two points (Haversine formula)
function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// Find nearest city to given coordinates
function findNearestCity(lat, lng) {
    let nearestCity = 'london';
    let nearestDistance = Infinity;
    
    for (const cityKey in cityData) {
        const city = cityData[cityKey];
        const distance = calculateDistance(lat, lng, city.center[0], city.center[1]);
        if (distance < nearestDistance) {
            nearestDistance = distance;
            nearestCity = cityKey;
        }
    }
    
    return nearestCity;
}

// Load city data
function loadCityData(cityKey) {
    if (cityData[cityKey]) {
        currentCity = cityKey;
        samplePokestops = cityData[cityKey].stops;
        console.log('Loaded ' + cityData[cityKey].name + ' with ' + samplePokestops.length + ' stops');
        return true;
    }
    return false;
}

// Calculate density score - how many other stops are nearby
function calculateDensityScore(stop, allStops, radius) {
    radius = radius || 0.5;
    let nearbyCount = 0;
    allStops.forEach(function(otherStop) {
        if (otherStop !== stop) {
            const distance = calculateDistance(stop.lat, stop.lng, otherStop.lat, otherStop.lng);
            if (distance < radius) {
                nearbyCount++;
            }
        }
    });
    return nearbyCount;
}

// DENSITY-AWARE routing algorithm - prefers routes through clusters (BALANCED VERSION)
function generateRouteStartToEnd(startLat, startLng, endLat, endLng) {
    const route = [];
    let currentLat = startLat;
    let currentLng = startLng;
    let totalDistance = 0;
    let availableStops = [].concat(samplePokestops);
    
    route.push({ lat: startLat, lng: startLng, name: "Start" });
    
    while (availableStops.length > 0) {
        let bestStop = null;
        let bestScore = -Infinity;
        let bestIndex = -1;
        
        availableStops.forEach(function(stop, index) {
            const currentToEnd = calculateDistance(currentLat, currentLng, endLat, endLng);
            const stopToEnd = calculateDistance(stop.lat, stop.lng, endLat, endLng);
            const progressToEnd = currentToEnd - stopToEnd;
            const detourDistance = calculateDistance(currentLat, currentLng, stop.lat, stop.lng);
            
            const densityScore = calculateDensityScore(stop, availableStops);
            
            const score = 
                (progressToEnd * 3.0) +
                (densityScore * 0.8) -
                (detourDistance * 1.2);
            
            if (score > bestScore) {
                bestScore = score;
                bestStop = stop;
                bestIndex = index;
            }
        });
        
        if (bestStop && bestScore > 0.5) {
            const distance = calculateDistance(currentLat, currentLng, bestStop.lat, bestStop.lng);
            route.push(bestStop);
            totalDistance += distance;
            currentLat = bestStop.lat;
            currentLng = bestStop.lng;
            availableStops.splice(bestIndex, 1);
        } else {
            break;
        }
    }
    
    const finalDistance = calculateDistance(currentLat, currentLng, endLat, endLng);
    totalDistance += finalDistance;
    route.push({ lat: endLat, lng: endLng, name: "End" });
    
    return {
        route: route,
        distance: totalDistance,
        stopsVisited: route.length - 2
    };
}

// Legacy function for backward compatibility
function generateRoute(startLat, startLng, targetDistance) {
    const route = [];
    let currentLat = startLat;
    let currentLng = startLng;
    let totalDistance = 0;
    let availableStops = [].concat(samplePokestops);
    
    route.push({ lat: startLat, lng: startLng, name: "Start Point" });
    
    while (totalDistance < targetDistance && availableStops.length > 0) {
        let nearestStop = null;
        let nearestDistance = Infinity;
        let nearestIndex = -1;
        
        availableStops.forEach(function(stop, index) {
            const distance = calculateDistance(currentLat, currentLng, stop.lat, stop.lng);
            if (distance < nearestDistance) {
                nearestDistance = distance;
                nearestStop = stop;
                nearestIndex = index;
            }
        });
        
        if (!nearestStop) break;
        
        const returnDistance = calculateDistance(nearestStop.lat, nearestStop.lng, startLat, startLng);
        if (totalDistance + nearestDistance + returnDistance > targetDistance) {
            break;
        }
        
        route.push(nearestStop);
        totalDistance += nearestDistance;
        currentLat = nearestStop.lat;
        currentLng = nearestStop.lng;
        availableStops.splice(nearestIndex, 1);
    }
    
    totalDistance += calculateDistance(currentLat, currentLng, startLat, startLng);
    route.push({ lat: startLat, lng: startLng, name: "End Point" });
    
    return {
        route: route,
        distance: totalDistance,
        stopsVisited: route.length - 2
    };
}
