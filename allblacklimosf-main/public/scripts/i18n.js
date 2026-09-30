(() => {
    'use strict';

    const phrases = {
        'Reservation assistance available 24/7': ['Assistance aux réservations 24 h/24 et 7 j/7', 'Reservierungsservice rund um die Uhr', 'Asistencia para reservas 24/7', 'Atendimento para reservas 24 horas'],
        'Skip to content': ['Aller au contenu', 'Zum Inhalt springen', 'Ir al contenido', 'Ir para o conteúdo'],
        'Home': ['Accueil', 'Startseite', 'Inicio', 'Início'],
        'About': ['À propos', 'Über uns', 'Nosotros', 'Sobre'],
        'About us': ['À propos de nous', 'Über uns', 'Sobre nosotros', 'Sobre nós'],
        'Services': ['Services', 'Services', 'Servicios', 'Serviços'],
        'Fleet': ['Flotte', 'Flotte', 'Flota', 'Frota'],
        'Our fleet': ['Notre flotte', 'Unsere Flotte', 'Nuestra flota', 'Nossa frota'],
        'Contact': ['Contact', 'Kontakt', 'Contacto', 'Contato'],
        'Company': ['Entreprise', 'Unternehmen', 'Empresa', 'Empresa'],
        'Popular services': ['Services populaires', 'Beliebte Services', 'Servicios destacados', 'Serviços mais procurados'],
        'Request a ride': ['Demander un trajet', 'Fahrt anfragen', 'Solicitar un viaje', 'Solicitar uma viagem'],
        'Request your ride': ['Demandez votre trajet', 'Fahrt anfragen', 'Solicite su viaje', 'Solicite sua viagem'],
        'Request this service': ['Demander ce service', 'Diesen Service anfragen', 'Solicitar este servicio', 'Solicitar este serviço'],
        'View service': ['Voir le service', 'Service ansehen', 'Ver servicio', 'Ver serviço'],
        'Open service page': ['Ouvrir la page du service', 'Serviceseite öffnen', 'Abrir página del servicio', 'Abrir página do serviço'],
        'Explore all services': ['Découvrir tous les services', 'Alle Services entdecken', 'Explorar todos los servicios', 'Explorar todos os serviços'],
        'Explore the fleet': ['Découvrir la flotte', 'Flotte entdecken', 'Explorar la flota', 'Explorar a frota'],
        'View full fleet': ['Voir toute la flotte', 'Gesamte Flotte ansehen', 'Ver flota completa', 'Ver frota completa'],
        'Tailored transportation': ['Transport sur mesure', 'Maßgeschneiderte Beförderung', 'Transporte a medida', 'Transporte sob medida'],
        'Choose the service that fits your itinerary.': ['Choisissez le service adapté à votre itinéraire.', 'Wählen Sie den Service passend zu Ihrer Reiseroute.', 'Elija el servicio que se adapte a su itinerario.', 'Escolha o serviço ideal para o seu itinerário.'],
        'Private chauffeur service · San Francisco': ['Service de chauffeur privé · San Francisco', 'Privater Chauffeurservice · San Francisco', 'Servicio de chófer privado · San Francisco', 'Serviço de motorista particular · San Francisco'],
        'More than a ride.': ['Bien plus qu’un trajet.', 'Mehr als eine Fahrt.', 'Más que un viaje.', 'Mais do que uma viagem.'],
        'A composed arrival.': ['Une arrivée en toute sérénité.', 'Eine souveräne Ankunft.', 'Una llegada impecable.', 'Uma chegada impecável.'],
        'Private chauffeur service tailored around your itinerary, with professional chauffeurs, attentive coordination, and a premium fleet for every occasion.': ['Un service de chauffeur privé adapté à votre itinéraire, avec des chauffeurs professionnels, une coordination attentive et une flotte haut de gamme pour chaque occasion.', 'Privater Chauffeurservice nach Ihrem Reiseplan, mit professionellen Chauffeuren, aufmerksamer Koordination und einer Premiumflotte für jeden Anlass.', 'Servicio de chófer privado adaptado a su itinerario, con chóferes profesionales, coordinación atenta y una flota premium para cada ocasión.', 'Serviço de motorista particular adaptado ao seu itinerário, com motoristas profissionais, coordenação atenciosa e uma frota premium para cada ocasião.'],
        '24/7 reservation assistance': ['Assistance aux réservations 24 h/24', 'Reservierungsservice rund um die Uhr', 'Asistencia para reservas 24/7', 'Atendimento para reservas 24 horas'],
        'San Francisco Bay Area': ['Baie de San Francisco', 'San Francisco Bay Area', 'Área de la Bahía de San Francisco', 'Região da Baía de San Francisco'],
        'Professional chauffeurs': ['Chauffeurs professionnels', 'Professionelle Chauffeure', 'Chóferes profesionales', 'Motoristas profissionais'],
        'Landing in the Bay Area?': ['Vous atterrissez dans la baie ?', 'Landung in der Bay Area?', '¿Llega al Área de la Bahía?', 'Chegando à Bay Area?'],
        'Your chauffeur is ready when you land.': ['Votre chauffeur est prêt dès votre atterrissage.', 'Ihr Chauffeur ist bei Ihrer Landung bereit.', 'Su chófer estará listo cuando aterrice.', 'Seu motorista estará pronto quando você pousar.'],
        '24/7 reservation support': ['ASSISTANCE AUX RÉSERVATIONS 24 H/24', 'RESERVIERUNGSSERVICE RUND UM DIE UHR', 'ASISTENCIA PARA RESERVAS 24/7', 'SUPORTE PARA RESERVAS 24 HORAS'],
        'Direct assistance whenever you need us.': ['Une assistance directe chaque fois que vous en avez besoin.', 'Direkte Hilfe, wann immer Sie uns brauchen.', 'Asistencia directa cuando la necesite.', 'Atendimento direto sempre que você precisar.'],
        'Experienced, discreet, and service-focused.': ['Expérimentés, discrets et attentifs au service.', 'Erfahren, diskret und serviceorientiert.', 'Experimentados, discretos y orientados al servicio.', 'Experientes, discretos e focados no atendimento.'],
        'Flight monitoring': ['Suivi des vols', 'Flugüberwachung', 'Monitoreo de vuelos', 'Monitoramento de voos'],
        'Real-time tracking for airport pickups.': ['Suivi en temps réel pour les prises en charge à l’aéroport.', 'Echtzeitverfolgung für Flughafenabholungen.', 'Seguimiento en tiempo real para recogidas en el aeropuerto.', 'Acompanhamento em tempo real para traslados no aeroporto.'],
        'Premium fleet': ['Flotte haut de gamme', 'Premiumflotte', 'Flota premium', 'Frota premium'],
        'Executive sedans, SUVs, Escalades & Sprinters.': ['Berlines de direction, SUV, Escalade et Sprinter.', 'Executive-Limousinen, SUVs, Escalades und Sprinter.', 'Sedanes ejecutivos, SUV, Escalades y Sprinters.', 'Sedãs executivos, SUVs, Escalades e Sprinters.'],
        'The All Black standard': ['Le standard All Black', 'Der All Black Standard', 'El estándar All Black', 'O padrão All Black'],
        'Luxury transportation,': ['Transport de luxe,', 'Luxusbeförderung,', 'Transporte de lujo,', 'Transporte de luxo,'],
        'executed with precision.': ['exécuté avec précision.', 'mit Präzision umgesetzt.', 'ejecutado con precisión.', 'executado com precisão.'],
        'At All Black Limo SF, every journey is planned around your schedule, privacy, and expectations. From the moment your reservation is confirmed, our team coordinates every detail to deliver a seamless and dependable experience.': ['Chez All Black Limo SF, chaque trajet est planifié selon votre horaire, votre confidentialité et vos attentes. Dès la confirmation de votre réservation, notre équipe coordonne chaque détail pour offrir une expérience fluide et fiable.', 'Bei All Black Limo SF wird jede Fahrt auf Ihren Zeitplan, Ihre Privatsphäre und Ihre Erwartungen abgestimmt. Ab der Reservierungsbestätigung koordiniert unser Team jedes Detail für ein reibungsloses und zuverlässiges Erlebnis.', 'En All Black Limo SF, cada viaje se planifica según su horario, privacidad y expectativas. Desde la confirmación de la reserva, nuestro equipo coordina cada detalle para ofrecer una experiencia fluida y confiable.', 'Na All Black Limo SF, cada viagem é planejada de acordo com sua agenda, privacidade e expectativas. Desde a confirmação da reserva, nossa equipe coordena cada detalhe para oferecer uma experiência tranquila e confiável.'],
        'From SFO airport transfers and private aviation to corporate roadshows, executive transportation, special events, and private journeys through Napa and Sonoma, our chauffeurs provide the professionalism and discretion our clients expect.': ['Des transferts à SFO et de l’aviation privée aux roadshows, déplacements de direction, événements spéciaux et trajets privés à Napa et Sonoma, nos chauffeurs offrent le professionnalisme et la discrétion attendus.', 'Von SFO-Flughafentransfers und Privatflügen bis zu Roadshows, Executive-Transport, besonderen Veranstaltungen und privaten Fahrten durch Napa und Sonoma bieten unsere Chauffeure die erwartete Professionalität und Diskretion.', 'Desde traslados en SFO y aviación privada hasta roadshows, transporte ejecutivo, eventos especiales y viajes privados por Napa y Sonoma, nuestros chóferes brindan el profesionalismo y la discreción esperados.', 'De traslados no SFO e aviação privada a roadshows, transporte executivo, eventos especiais e viagens particulares por Napa e Sonoma, nossos motoristas oferecem o profissionalismo e a discrição esperados.'],
        'Professional Chauffeurs': ['Chauffeurs professionnels', 'Professionelle Chauffeure', 'Chóferes profesionales', 'Motoristas profissionais'],
        '24/7 Reservation Support': ['Assistance aux réservations 24 h/24', 'Reservierungsservice rund um die Uhr', 'Asistencia para reservas 24/7', 'Suporte para reservas 24 horas'],
        'Premium Executive Fleet': ['Flotte exécutive haut de gamme', 'Premium-Executive-Flotte', 'Flota ejecutiva premium', 'Frota executiva premium'],
        'Real-Time Flight Monitoring': ['Suivi des vols en temps réel', 'Flugüberwachung in Echtzeit', 'Monitoreo de vuelos en tiempo real', 'Monitoramento de voos em tempo real'],
        'Discover our approach': ['Découvrir notre approche', 'Unseren Ansatz entdecken', 'Descubrir nuestro enfoque', 'Conhecer nossa abordagem'],
        'Services for every itinerary': ['Des services pour chaque itinéraire', 'Services für jede Reiseroute', 'Servicios para cada itinerario', 'Serviços para cada itinerário'],
        'One standard of service.': ['Un seul standard de service.', 'Ein Servicestandard.', 'Un estándar de servicio.', 'Um padrão de atendimento.'],
        'Many reasons to travel.': ['Mille raisons de voyager.', 'Viele Gründe zu reisen.', 'Muchas razones para viajar.', 'Muitos motivos para viajar.'],
        'Choose a focused service page to see how we plan each type of journey, what information we need, and which format may fit best.': ['Choisissez une page de service pour découvrir comment nous planifions chaque trajet, les informations nécessaires et le format le plus adapté.', 'Wählen Sie eine Serviceseite und erfahren Sie, wie wir jede Fahrt planen, welche Angaben wir benötigen und welches Format am besten passt.', 'Elija una página de servicio para conocer cómo planificamos cada viaje, qué información necesitamos y qué formato es el más adecuado.', 'Escolha uma página de serviço para entender como planejamos cada viagem, quais informações precisamos e qual formato é mais adequado.'],
        'A vehicle for the moment': ['Un véhicule pour chaque moment', 'Das passende Fahrzeug', 'Un vehículo para cada momento', 'Um veículo para cada momento'],
        'Presence on the outside.': ['Une présence remarquable.', 'Präsenz nach außen.', 'Presencia exterior.', 'Presença por fora.'],
        'Quiet comfort within.': ['Un confort paisible à l’intérieur.', 'Ruhiger Komfort im Inneren.', 'Confort sereno en el interior.', 'Conforto silencioso por dentro.'],
        'Precision in motion': ['La précision en mouvement', 'Präzision in Bewegung', 'Precisión en movimiento', 'Precisão em movimento'],
        'Premium transportation': ['Transport haut de gamme', 'Premium-Beförderung', 'Transporte premium', 'Transporte premium'],
        'that moves': ['qui avance', 'das sich', 'que se adapta', 'que acompanha'],
        'with your schedule.': ['à votre rythme.', 'Ihrem Zeitplan anpasst.', 'a su horario.', 'a sua agenda.'],
        'Find your service': ['Trouver votre service', 'Passenden Service finden', 'Encontrar su servicio', 'Encontrar seu serviço'],
        'Before you reserve': ['Avant de réserver', 'Vor der Reservierung', 'Antes de reservar', 'Antes de reservar'],
        'Questions,': ['Des questions,', 'Fragen,', 'Preguntas,', 'Dúvidas,'],
        'answered clearly.': ['des réponses claires.', 'klar beantwortet.', 'respondidas con claridad.', 'respondidas com clareza.'],
        'Airport Transfers': ['Transferts aéroport', 'Flughafentransfers', 'Traslados al aeropuerto', 'Traslados de aeroporto'],
        'Corporate Travel': ['Déplacements professionnels', 'Geschäftsreisen', 'Viajes corporativos', 'Viagens corporativas'],
        'Hourly Chauffeur': ['Chauffeur à l’heure', 'Stundenweiser Chauffeur', 'Chófer por hora', 'Motorista por hora'],
        'Point to Point': ['Point à point', 'Punkt-zu-Punkt', 'Punto a punto', 'Ponto a ponto'],
        'Roadshows & Events': ['Roadshows et événements', 'Roadshows & Events', 'Roadshows y eventos', 'Roadshows e eventos'],
        'Napa & Sonoma': ['Napa et Sonoma', 'Napa & Sonoma', 'Napa y Sonoma', 'Napa e Sonoma'],
        'Special Occasions': ['Occasions spéciales', 'Besondere Anlässe', 'Ocasiones especiales', 'Ocasiões especiais'],
        'Group Transportation': ['Transport de groupe', 'Gruppentransport', 'Transporte para grupos', 'Transporte para grupos'],
        'San Francisco Airport Transfers': ['Transferts aéroport à San Francisco', 'Flughafentransfers in San Francisco', 'Traslados de aeropuerto en San Francisco', 'Traslados de aeroporto em San Francisco'],
        'Corporate & Executive Transportation': ['Transport professionnel et exécutif', 'Corporate- und Executive-Transport', 'Transporte corporativo y ejecutivo', 'Transporte corporativo e executivo'],
        'Hourly Chauffeur Service': ['Service de chauffeur à l’heure', 'Stundenweiser Chauffeurservice', 'Servicio de chófer por hora', 'Serviço de motorista por hora'],
        'Point-to-Point Black Car Service': ['Service de voiture avec chauffeur point à point', 'Punkt-zu-Punkt Black-Car-Service', 'Servicio de vehículo privado punto a punto', 'Serviço de carro executivo ponto a ponto'],
        'Roadshows, Conferences & Event Transportation': ['Transport pour roadshows, conférences et événements', 'Transport für Roadshows, Konferenzen und Events', 'Transporte para roadshows, conferencias y eventos', 'Transporte para roadshows, conferências e eventos'],
        'Napa & Sonoma Wine Country Chauffeur': ['Chauffeur pour Napa et Sonoma', 'Chauffeur für Napa & Sonoma Wine Country', 'Chófer para Napa y Sonoma', 'Motorista para Napa e Sonoma'],
        'Weddings & Special Occasions': ['Mariages et occasions spéciales', 'Hochzeiten & besondere Anlässe', 'Bodas y ocasiones especiales', 'Casamentos e ocasiões especiais'],
        'Luxury Group Transportation': ['Transport de groupe haut de gamme', 'Luxuriöser Gruppentransport', 'Transporte de lujo para grupos', 'Transporte de luxo para grupos'],
        'Calm, coordinated airport pickups and drop-offs built around your itinerary.': ['Des transferts aéroport calmes et coordonnés, organisés selon votre itinéraire.', 'Ruhige, koordinierte Flughafenabholungen und -transfers nach Ihrem Reiseplan.', 'Recogidas y traslados al aeropuerto coordinados según su itinerario.', 'Embarques e desembarques no aeroporto coordenados de acordo com seu itinerário.'],
        'Executive ground transportation that respects calendars, privacy, and presentation.': ['Un transport exécutif respectueux des horaires, de la confidentialité et de la présentation.', 'Executive-Beförderung mit Rücksicht auf Termine, Privatsphäre und Auftreten.', 'Transporte ejecutivo que respeta horarios, privacidad y presentación.', 'Transporte executivo que respeita agendas, privacidade e apresentação.'],
        'Keep a private vehicle and chauffeur available while your plans evolve.': ['Gardez un véhicule privé et un chauffeur à disposition pendant que vos plans évoluent.', 'Ein privates Fahrzeug mit Chauffeur bleibt verfügbar, während sich Ihre Pläne entwickeln.', 'Mantenga un vehículo privado y un chófer disponibles mientras cambian sus planes.', 'Mantenha um veículo particular e um motorista disponíveis enquanto seus planos evoluem.'],
        'A polished direct transfer between two locations with no ride-hailing uncertainty.': ['Un transfert direct et soigné entre deux lieux, sans l’incertitude des applications.', 'Ein gepflegter Direkttransfer zwischen zwei Orten ohne Ride-Hailing-Unsicherheit.', 'Un traslado directo y refinado entre dos lugares, sin incertidumbre.', 'Um traslado direto e refinado entre dois locais, sem incertezas de aplicativos.'],
        'Structured transportation for packed schedules, important guests, and live events.': ['Un transport structuré pour les agendas chargés, les invités importants et les événements.', 'Strukturierter Transport für volle Zeitpläne, wichtige Gäste und Live-Events.', 'Transporte estructurado para agendas intensas, invitados importantes y eventos.', 'Transporte estruturado para agendas intensas, convidados importantes e eventos.'],
        'A private, comfortable way to enjoy Napa Valley and Sonoma at your own pace.': ['Une manière privée et confortable de découvrir Napa et Sonoma à votre rythme.', 'Napa Valley und Sonoma privat und komfortabel im eigenen Tempo erleben.', 'Una forma privada y cómoda de disfrutar Napa y Sonoma a su ritmo.', 'Uma forma particular e confortável de aproveitar Napa e Sonoma no seu ritmo.'],
        'Elegant private transportation for the moments that deserve extra attention.': ['Un transport privé élégant pour les moments qui méritent une attention particulière.', 'Elegante private Beförderung für Momente, die besondere Aufmerksamkeit verdienen.', 'Transporte privado elegante para los momentos que merecen atención especial.', 'Transporte particular elegante para momentos que merecem atenção especial.'],
        'Comfortable group movement for teams, guests, families, and event parties.': ['Des déplacements de groupe confortables pour équipes, invités, familles et événements.', 'Komfortable Gruppenbeförderung für Teams, Gäste, Familien und Veranstaltungen.', 'Transporte cómodo para equipos, invitados, familias y grupos de eventos.', 'Transporte confortável para equipes, convidados, famílias e grupos de eventos.'],
        'Move between the Bay Area and its major airports with a private chauffeur, a carefully selected vehicle, and a pickup plan designed before you land.': ['Voyagez entre la baie et ses principaux aéroports avec un chauffeur privé, un véhicule soigneusement sélectionné et un plan de prise en charge préparé avant votre atterrissage.', 'Reisen Sie zwischen der Bay Area und ihren wichtigsten Flughäfen mit privatem Chauffeur, sorgfältig ausgewähltem Fahrzeug und einem Abholplan, der vor Ihrer Landung feststeht.', 'Viaje entre el Área de la Bahía y sus principales aeropuertos con un chófer privado, un vehículo cuidadosamente seleccionado y un plan de recogida preparado antes de aterrizar.', 'Viaje entre a Bay Area e seus principais aeroportos com motorista particular, veículo cuidadosamente selecionado e um plano de embarque definido antes do pouso.'],
        'From a single executive transfer to a multi-stop business itinerary, every movement is planned to support punctual, focused travel across San Francisco and Silicon Valley.': ['D’un transfert exécutif unique à un itinéraire professionnel à plusieurs arrêts, chaque déplacement est planifié pour un voyage ponctuel et efficace à San Francisco et dans la Silicon Valley.', 'Vom einzelnen Executive-Transfer bis zur Geschäftsroute mit mehreren Stopps wird jede Fahrt für pünktliches und konzentriertes Reisen in San Francisco und Silicon Valley geplant.', 'Desde un traslado ejecutivo hasta un itinerario de negocios con varias paradas, cada movimiento se planifica para viajar con puntualidad por San Francisco y Silicon Valley.', 'De um traslado executivo a um itinerário corporativo com várias paradas, cada deslocamento é planejado para apoiar viagens pontuais por San Francisco e Silicon Valley.'],
        'Hourly service gives you the flexibility to make multiple stops, adjust timing, and keep your vehicle nearby without arranging a new ride for every movement.': ['Le service à l’heure vous permet d’effectuer plusieurs arrêts, d’ajuster les horaires et de garder votre véhicule à proximité sans réserver un nouveau trajet à chaque déplacement.', 'Der Stundenservice bietet Flexibilität für mehrere Stopps, Zeitänderungen und ein Fahrzeug in Ihrer Nähe, ohne jede Fahrt neu zu buchen.', 'El servicio por hora permite realizar varias paradas, ajustar horarios y mantener el vehículo cerca sin organizar un nuevo viaje para cada movimiento.', 'O serviço por hora oferece flexibilidade para várias paradas, ajustes de horário e um veículo próximo, sem precisar solicitar uma nova corrida a cada deslocamento.'],
        'For dinners, meetings, residences, hotels, and venues, point-to-point service delivers a reserved vehicle and a clear pickup plan tailored to the journey.': ['Pour les dîners, réunions, résidences, hôtels et lieux d’événement, le service point à point fournit un véhicule réservé et un plan de prise en charge adapté.', 'Für Abendessen, Meetings, Wohnsitze, Hotels und Veranstaltungsorte bietet der Punkt-zu-Punkt-Service ein reserviertes Fahrzeug und einen klaren Abholplan.', 'Para cenas, reuniones, residencias, hoteles y recintos, el servicio punto a punto ofrece un vehículo reservado y un plan de recogida claro.', 'Para jantares, reuniões, residências, hotéis e eventos, o serviço ponto a ponto oferece veículo reservado e um plano de embarque claro.'],
        'Complex event days require more than a vehicle. We help organize the sequence of pickups, destinations, time windows, and passenger needs into a clear ground transportation plan.': ['Les journées d’événement complexes exigent plus qu’un véhicule. Nous organisons les prises en charge, destinations, horaires et besoins des passagers dans un plan de transport clair.', 'Komplexe Veranstaltungstage erfordern mehr als ein Fahrzeug. Wir ordnen Abholungen, Ziele, Zeitfenster und Fahrgastanforderungen in einem klaren Transportplan.', 'Los eventos complejos requieren más que un vehículo. Organizamos recogidas, destinos, horarios y necesidades de los pasajeros en un plan claro.', 'Eventos complexos exigem mais do que um veículo. Organizamos embarques, destinos, janelas de horário e necessidades dos passageiros em um plano claro.'],
        'Turn a day in wine country into a composed private itinerary, with a chauffeur handling the road while your group focuses on tastings, dining, and the landscape.': ['Transformez une journée dans la région viticole en itinéraire privé serein, avec un chauffeur au volant pendant que votre groupe profite des dégustations, des repas et du paysage.', 'Machen Sie aus einem Tag im Wine Country eine entspannte private Route, während der Chauffeur fährt und Ihre Gruppe Verkostungen, Essen und Landschaft genießt.', 'Convierta un día en Wine Country en un itinerario privado, con un chófer al volante mientras su grupo disfruta de catas, gastronomía y paisajes.', 'Transforme um dia em Wine Country em um itinerário particular tranquilo, com um motorista cuidando da estrada enquanto seu grupo aproveita degustações, gastronomia e paisagens.'],
        'Create a smoother arrival and departure for weddings, anniversaries, birthdays, galas, and private celebrations with a vehicle selected for the occasion.': ['Facilitez les arrivées et départs pour mariages, anniversaires, galas et célébrations privées avec un véhicule choisi pour l’occasion.', 'Gestalten Sie Ankunft und Abfahrt bei Hochzeiten, Jubiläen, Geburtstagen, Galas und privaten Feiern mit einem passenden Fahrzeug reibungsloser.', 'Logre llegadas y salidas más fluidas para bodas, aniversarios, cumpleaños, galas y celebraciones privadas con un vehículo seleccionado para la ocasión.', 'Tenha chegadas e saídas mais tranquilas em casamentos, aniversários, festas, galas e celebrações particulares com um veículo escolhido para a ocasião.'],
        'Keep your group together with an appropriately sized vehicle and a clear movement plan for airports, hotels, venues, meetings, or celebrations.': ['Gardez votre groupe réuni avec un véhicule de taille adaptée et un plan clair pour aéroports, hôtels, événements, réunions ou célébrations.', 'Halten Sie Ihre Gruppe mit einem passend dimensionierten Fahrzeug und einem klaren Ablaufplan für Flughäfen, Hotels, Veranstaltungsorte, Meetings oder Feiern zusammen.', 'Mantenga a su grupo unido con un vehículo del tamaño adecuado y un plan claro para aeropuertos, hoteles, recintos, reuniones o celebraciones.', 'Mantenha seu grupo unido com um veículo de tamanho adequado e um plano claro para aeroportos, hotéis, eventos, reuniões ou celebrações.'],
        'Airport transfers planned around the terminal, flight, and luggage.': ['Des transferts aéroport planifiés selon le terminal, le vol et les bagages.', 'Flughafentransfers rund um Terminal, Flug und Gepäck geplant.', 'Traslados al aeropuerto planificados según terminal, vuelo y equipaje.', 'Traslados de aeroporto planejados de acordo com terminal, voo e bagagem.'],
        'Executive transportation that follows the business agenda.': ['Un transport exécutif qui suit l’agenda professionnel.', 'Executive-Transport nach der Geschäftsagenda.', 'Transporte ejecutivo que sigue la agenda de negocios.', 'Transporte executivo que acompanha a agenda corporativa.'],
        'A dedicated chauffeur and vehicle for a flexible schedule.': ['Un chauffeur et un véhicule dédiés pour un horaire flexible.', 'Ein eigener Chauffeur und ein Fahrzeug für flexible Zeitpläne.', 'Un chófer y un vehículo dedicados para un horario flexible.', 'Motorista e veículo exclusivos para uma agenda flexível.'],
        'Direct private transportation from pickup to destination.': ['Transport privé direct du départ à la destination.', 'Direkte private Beförderung vom Abholort zum Ziel.', 'Transporte privado directo desde la recogida hasta el destino.', 'Transporte particular direto do embarque ao destino.'],
        'Event transportation built from a complete movement plan.': ['Un transport événementiel fondé sur un plan de déplacement complet.', 'Eventtransport auf Basis eines vollständigen Bewegungsplans.', 'Transporte para eventos basado en un plan completo de movimientos.', 'Transporte para eventos baseado em um plano completo de deslocamentos.'],
        'A private Wine Country itinerary with the driving handled.': ['Un itinéraire privé dans la région viticole, conduite comprise.', 'Eine private Wine-Country-Route, bei der das Fahren übernommen wird.', 'Un itinerario privado por Wine Country con la conducción resuelta.', 'Um itinerário particular por Wine Country com a condução por nossa conta.'],
        'Transportation coordinated around the occasion timeline.': ['Un transport coordonné selon le calendrier de l’événement.', 'Transport abgestimmt auf den Zeitplan des Anlasses.', 'Transporte coordinado según el cronograma de la ocasión.', 'Transporte coordenado de acordo com o cronograma da ocasião.'],
        'Group transportation sized for people, luggage, and the route.': ['Transport de groupe dimensionné pour les passagers, les bagages et l’itinéraire.', 'Gruppentransport passend zu Personen, Gepäck und Route.', 'Transporte para grupos dimensionado según pasajeros, equipaje y ruta.', 'Transporte para grupos dimensionado para pessoas, bagagens e rota.'],
        'Service guide': ['Guide du service', 'Serviceleitfaden', 'Guía del servicio', 'Guia do serviço'],
        'The service at a glance': ['Le service en un coup d’œil', 'Der Service auf einen Blick', 'El servicio de un vistazo', 'O serviço em resumo'],
        'How it works': ['Comment ça marche', 'So funktioniert es', 'Cómo funciona', 'Como funciona'],
        'A simple request.': ['Une demande simple.', 'Eine einfache Anfrage.', 'Una solicitud sencilla.', 'Uma solicitação simples.'],
        'A considered plan.': ['Un plan soigneusement étudié.', 'Ein durchdachter Plan.', 'Un plan bien pensado.', 'Um planejamento cuidadoso.'],
        'Service questions': ['Questions sur le service', 'Fragen zum Service', 'Preguntas sobre el servicio', 'Dúvidas sobre o serviço'],
        'Know what to': ['Sachez à quoi', 'Wissen, was Sie', 'Sepa qué', 'Saiba o que'],
        'expect.': ['vous attendre.', 'erwartet.', 'esperar.', 'esperar.'],
        'Professional in presence.': ['Professionnels dans notre présence.', 'Professionell im Auftreten.', 'Profesionales en presencia.', 'Profissionais na presença.'],
        'Personal in service.': ['Personnels dans le service.', 'Persönlich im Service.', 'Personales en el servicio.', 'Pessoais no atendimento.'],
        'Why we exist': ['Notre raison d’être', 'Warum es uns gibt', 'Por qué existimos', 'Por que existimos'],
        'To make every journey feel': ['Pour rendre chaque trajet', 'Damit sich jede Fahrt', 'Para que cada viaje se sienta', 'Para fazer cada viagem parecer'],
        'effortless.': ['sans effort.', 'mühelos anfühlt.', 'sin esfuerzo.', 'simples e tranquila.'],
        'Explore our services': ['Découvrir nos services', 'Unsere Services entdecken', 'Explorar nuestros servicios', 'Explorar nossos serviços'],
        'A fleet selected for': ['Une flotte sélectionnée pour', 'Eine Flotte ausgewählt für', 'Una flota seleccionada para', 'Uma frota selecionada para'],
        'every journey.': ['chaque trajet.', 'jede Fahrt.', 'cada viaje.', 'cada viagem.'],
        'Tell us about the journey': ['Parlez-nous du trajet', 'Erzählen Sie uns von der Fahrt', 'Cuéntenos sobre el viaje', 'Conte-nos sobre a viagem'],
        'Your ride begins': ['Votre trajet commence', 'Ihre Fahrt beginnt', 'Su viaje comienza', 'Sua viagem começa'],
        'with the': ['avec les', 'mit den', 'con los', 'com os'],
        'right details.': ['bons détails.', 'richtigen Angaben.', 'detalles correctos.', 'detalhes certos.'],
        'Ride request': ['Demande de trajet', 'Fahrtanfrage', 'Solicitud de viaje', 'Solicitação de viagem'],
        'Required fields are marked with an asterisk. Online ride requests must be scheduled at least 12 hours in advance.': ['Les champs obligatoires sont indiqués par un astérisque. Les demandes en ligne doivent être programmées au moins 12 heures à l’avance.', 'Pflichtfelder sind mit einem Sternchen gekennzeichnet. Online-Fahrtanfragen müssen mindestens 12 Stunden im Voraus geplant werden.', 'Los campos obligatorios están marcados con un asterisco. Las solicitudes en línea deben programarse con al menos 12 horas de anticipación.', 'Os campos obrigatórios são marcados com um asterisco. As solicitações online devem ser agendadas com pelo menos 12 horas de antecedência.'],
        'First name *': ['Prénom *', 'Vorname *', 'Nombre *', 'Nome *'],
        'Last name *': ['Nom *', 'Nachname *', 'Apellido *', 'Sobrenome *'],
        'Phone *': ['Téléphone *', 'Telefon *', 'Teléfono *', 'Telefone *'],
        'Service *': ['Service *', 'Service *', 'Servicio *', 'Serviço *'],
        'Preferred vehicle': ['Véhicule préféré', 'Bevorzugtes Fahrzeug', 'Vehículo preferido', 'Veículo preferido'],
        'Pickup date *': ['Date de prise en charge *', 'Abholdatum *', 'Fecha de recogida *', 'Data de embarque *'],
        'Pickup time *': ['Heure de prise en charge *', 'Abholzeit *', 'Hora de recogida *', 'Horário de embarque *'],
        'U.S. format: Month / Day / Year': ['Format américain : Mois / Jour / Année', 'US-Format: Monat / Tag / Jahr', 'Formato de EE. UU.: Mes / Día / Año', 'Formato dos EUA: Mês / Dia / Ano'],
        '12-hour clock · San Francisco local time': ['Format 12 heures · heure locale de San Francisco', '12-Stunden-Format · Ortszeit San Francisco', 'Formato de 12 horas · hora local de San Francisco', 'Formato de 12 horas · horário local de San Francisco'],
        'Open pickup date calendar': ['Ouvrir le calendrier de prise en charge', 'Abholdatum-Kalender öffnen', 'Abrir calendario de recogida', 'Abrir calendário da data de embarque'],
        'Pickup time in 12-hour format': ['Heure de prise en charge au format 12 heures', 'Abholzeit im 12-Stunden-Format', 'Hora de recogida en formato de 12 horas', 'Horário de embarque no formato de 12 horas'],
        'Pickup hour': ['Heure de prise en charge', 'Abholstunde', 'Hora de recogida', 'Hora de embarque'],
        'Pickup minute': ['Minute de prise en charge', 'Abholminute', 'Minuto de recogida', 'Minuto de embarque'],
        'AM or PM': ['AM ou PM', 'AM oder PM', 'AM o PM', 'AM ou PM'],
        'Passengers *': ['Passagers *', 'Fahrgäste *', 'Pasajeros *', 'Passageiros *'],
        'Luggage count': ['Nombre de bagages', 'Anzahl Gepäckstücke', 'Cantidad de equipaje', 'Quantidade de bagagens'],
        'Pickup location *': ['Lieu de prise en charge *', 'Abholort *', 'Lugar de recogida *', 'Local de embarque *'],
        'Destination *': ['Destination *', 'Ziel *', 'Destino *', 'Destino *'],
        'Flight number': ['Numéro de vol', 'Flugnummer', 'Número de vuelo', 'Número do voo'],
        'Estimated hours': ['Durée estimée', 'Geschätzte Stunden', 'Horas estimadas', 'Horas estimadas'],
        'Discount coupon': ['Code de réduction', 'Rabattcode', 'Cupón de descuento', 'Cupom de desconto'],
        'Itinerary and special requests': ['Itinéraire et demandes spéciales', 'Reiseroute und besondere Wünsche', 'Itinerario y solicitudes especiales', 'Itinerário e solicitações especiais'],
        'Select a service': ['Sélectionnez un service', 'Service auswählen', 'Seleccione un servicio', 'Selecione um serviço'],
        'Recommend the best fit': ['Recommandez la meilleure option', 'Beste Option empfehlen', 'Recomendar la mejor opción', 'Recomendar a melhor opção'],
        'Other / custom itinerary': ['Autre / itinéraire personnalisé', 'Andere / individuelle Route', 'Otro / itinerario personalizado', 'Outro / itinerário personalizado'],
        'Send ride request': ['Envoyer la demande', 'Fahrtanfrage senden', 'Enviar solicitud', 'Enviar solicitação'],
        'Reservation timing': ['Délai de réservation', 'Reservierungszeitpunkt', 'Anticipación de la reserva', 'Prazo da reserva'],
        'Advance notice required': ['Préavis requis', 'Vorlaufzeit erforderlich', 'Se requiere anticipación', 'Antecedência obrigatória'],
        'Online ride requests must be scheduled at least 12 hours in advance. For a pickup sooner than that, please email us and our team will check availability.': ['Les demandes de trajet en ligne doivent être programmées au moins 12 heures à l’avance. Pour une prise en charge plus tôt, veuillez nous envoyer un e-mail afin que notre équipe vérifie les disponibilités.', 'Online-Fahrtanfragen müssen mindestens 12 Stunden im Voraus geplant werden. Für eine frühere Abholung senden Sie uns bitte eine E-Mail; unser Team prüft die Verfügbarkeit.', 'Las solicitudes de viaje en línea deben programarse con al menos 12 horas de anticipación. Para una recogida antes de ese plazo, envíenos un correo y nuestro equipo verificará la disponibilidad.', 'As solicitações de corrida online devem ser agendadas com pelo menos 12 horas de antecedência. Para uma corrida antes desse prazo, envie um e-mail e nossa equipe verificará a disponibilidade.'],
        'Choose another time': ['Choisir une autre heure', 'Andere Uhrzeit wählen', 'Elegir otro horario', 'Escolher outro horário'],
        'Email us': ['Nous écrire', 'E-Mail senden', 'Enviar correo', 'Enviar e-mail'],
        'Close notice': ['Fermer l’avis', 'Hinweis schließen', 'Cerrar aviso', 'Fechar aviso'],
        'Direct assistance': ['Assistance directe', 'Direkte Unterstützung', 'Asistencia directa', 'Atendimento direto'],
        'Tell us where you need to be.': ['Dites-nous où vous devez aller.', 'Sagen Sie uns, wohin Sie müssen.', 'Díganos adónde necesita ir.', 'Diga-nos onde você precisa estar.'],
        'We’ll handle the rest.': ['Nous nous occupons du reste.', 'Wir kümmern uns um den Rest.', 'Nos encargamos del resto.', 'Nós cuidamos do resto.'],
        'Call or text anytime': ['Appelez ou écrivez à tout moment', 'Jederzeit anrufen oder schreiben', 'Llame o escriba en cualquier momento', 'Ligue ou envie mensagem a qualquer hora'],
        'Service region': ['Zone de service', 'Servicegebiet', 'Área de servicio', 'Região atendida'],
        'Send a message': ['Envoyer un message', 'Nachricht senden', 'Enviar un mensaje', 'Enviar uma mensagem'],
        'Name *': ['Nom *', 'Name *', 'Nombre *', 'Nome *'],
        'Phone': ['Téléphone', 'Telefon', 'Teléfono', 'Telefone'],
        'Topic *': ['Sujet *', 'Thema *', 'Asunto *', 'Assunto *'],
        'Message *': ['Message *', 'Nachricht *', 'Mensaje *', 'Mensagem *'],
        'Select a topic': ['Sélectionnez un sujet', 'Thema auswählen', 'Seleccione un tema', 'Selecione um assunto'],
        'Send message': ['Envoyer le message', 'Nachricht senden', 'Enviar mensaje', 'Enviar mensagem'],
        'Your itinerary deserves precision': ['Votre itinéraire mérite de la précision', 'Ihre Reiseroute verdient Präzision', 'Su itinerario merece precisión', 'Seu itinerário merece precisão'],
        'Move through the Bay Area': ['Parcourez la baie', 'Bewegen Sie sich durch die Bay Area', 'Muévase por el Área de la Bahía', 'Circule pela Bay Area'],
        'on your terms.': ['à votre façon.', 'nach Ihren Vorstellungen.', 'a su manera.', 'do seu jeito.'],
        'Privacy': ['Confidentialité', 'Datenschutz', 'Privacidad', 'Privacidade'],
        'Terms': ['Conditions', 'Bedingungen', 'Términos', 'Termos'],
        'Call': ['Appeler', 'Anrufen', 'Llamar', 'Ligar'],
        'Request ride': ['Demander un trajet', 'Fahrt anfragen', 'Solicitar viaje', 'Solicitar viagem']
    };

    const languages = ['fr', 'de', 'es', 'pt'];
    const textOriginals = new WeakMap();
    const attributeOriginals = new WeakMap();
    const excluded = 'script, style, noscript, code, pre, .notranslate, [translate="no"]';

    const normalized = (value) => value.replace(/\s+/g, ' ').trim();

    const translationFor = (source, language) => {
        const entry = phrases[normalized(source)];
        const index = languages.indexOf(language);
        return entry && index >= 0 ? entry[index] : null;
    };

    const translateTextNode = (node, language) => {
        if (!textOriginals.has(node)) textOriginals.set(node, node.nodeValue || '');
        const original = textOriginals.get(node) || '';
        node.nodeValue = original;
        if (language === 'en') return;

        const translated = translationFor(original, language);
        if (!translated) return;
        const leading = original.match(/^\s*/)?.[0] || '';
        const trailing = original.match(/\s*$/)?.[0] || '';
        node.nodeValue = `${leading}${translated}${trailing}`;
    };

    const translateAttributes = (element, language) => {
        const names = ['placeholder', 'title', 'aria-label'];
        if (!attributeOriginals.has(element)) attributeOriginals.set(element, {});
        const originals = attributeOriginals.get(element);

        names.forEach((name) => {
            if (!element.hasAttribute(name)) return;
            if (!(name in originals)) originals[name] = element.getAttribute(name) || '';
            element.setAttribute(name, originals[name]);
            if (language === 'en') return;
            const translated = translationFor(originals[name], language);
            if (translated) element.setAttribute(name, translated);
        });
    };

    const apply = (language = 'en') => {
        const selected = ['en', ...languages].includes(language) ? language : 'en';
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
            acceptNode(node) {
                const parent = node.parentElement;
                if (!parent || parent.closest(excluded) || !normalized(node.nodeValue || '')) return NodeFilter.FILTER_REJECT;
                return NodeFilter.FILTER_ACCEPT;
            },
        });

        const nodes = [];
        while (walker.nextNode()) nodes.push(walker.currentNode);
        nodes.forEach((node) => translateTextNode(node, selected));
        document.querySelectorAll('[placeholder], [title], [aria-label]').forEach((element) => {
            if (!element.closest(excluded)) translateAttributes(element, selected);
        });

        document.documentElement.lang = selected === 'pt' ? 'pt-BR' : (selected === 'en' ? 'en-US' : selected);
        document.documentElement.dataset.language = selected;
        try {
            window.localStorage.setItem('abl_language', selected);
        } catch (error) {
            // The translation remains active even if browser storage is disabled.
        }
        window.dispatchEvent(new CustomEvent('abl:languagechange', { detail: { language: selected } }));
    };

    window.AllBlackI18n = { apply };
})();
