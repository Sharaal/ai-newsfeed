# AI Newsfeed

Das Projekt soll helfen alle Neuigkeiten zu sammeln, aber nur diejenigen in einem Feed auszugeben, die für einen Nutzer relevant sind.

## Workflow

Beispielartikel: https://www.heise.de/news/Weltraumteleskop-James-Webb-bildet-erstmals-Exoplaneten-direkt-ab-10461248.html

- Neuigkeiten kommen rein
- Sie werden getaggt nach Kategorien und für jede Kategorie bekommen sie eine Relevanz Bewertung von 1 bis 10
- Kategorien haben eine hierarchische Struktur, z.B. kann es einen Tag "Wissenschaft" (science) geben und darunter Tags wie "Astronomie" (astronomy) und "James Webb" (james_webb)

z.B. der Beispielartikel könnte die Tags "Wissenschaft" 5 -> "Astronomie" 8 -> "James Webb" 10 bekommen

Die Kategorien könnte man im Frontmatter Part angeben:
```
categories:
  science: 5
  astronomy: 8
  james_webb: 10
```

- Je spezialisierter eine Kategorie desto einfacher kann ein Artikel eine hohe Relevanz darin bekommen
- Evtl. macht es Sinn generell die Regel zu machen eine übergeordnete Kategorie kann nur eine gleich oder niedrigere Relevanz bekommen wie die darunterliegenden Kategorien

z.B. der Beispielartikel ist für jemanden der sich für "James Webb" interessiert sehr relavant, also 10. Für einen "Astronomie" Begeisterten wäre die Nachricht, dass ein Exoplanet zum ersten Mal abgebildet werden konnte eine 8 sein. Für die "Wissenschaft" ganz Allgemein ist das eine interessante Neuigkeit, aber nicht bahnbrechend weltbewegend an sich, also eher eine 5.

- Es soll mehrere Quality Gates geben, die von KI vorgecheckt und mit Informationen angereichert werden können aber von menschlichen Personen verifiziert werden müssen. Jeder erfolgreich absolviertes Quality Gate wird beim Artikel vermerkt, erst wenn alle Quality Gates erfolgreich sind, ist der Artikel verfügbar

z.B. könnte es Quality Gates geben wie "Korrekturlesen", daher Artikel werden auf Rechtschreibung und Grammatik gecheckt. "Faktencheck", alle Infos des Artikels werden auf ihre Richtigkeit überprüft und mit Quellenangaben versehen. "Kategorien", die getaggte Kategorien und deren Relevanz wird auf deren Richtigkeit überprüft.

Die Quality Gates könnte man im Frontmatter Part angeben:
```
qualitygates:
  spelling: true
  facts: false
  tagging: false
```

- Wird der Inhalt vom Artikel geändert, kann angegeben werden, ob und welche abgehakten Quality Gates nochmal durchlaufen werden müssen
- Beim nochmaligen Check wird dann die Artikeländerung seit dem letzten Check dieses Quality Gates farblich hervorgehoben. Ebenso kann angezeigt werden wer wann was geändert hat (z.B. durch git)
- Es gibt spezielle Feeds für noch nicht freigegebene Neuigkeiten mit bestimmten Quality Gates, die noch fehlen, sortiert nach Relevanz

z.B. ein Feed wie `?order_by=relevance&qualitygates=facts-false,spelling-true` gibt alle Neuigkeiten zurück, bei denen der Faktencheck fehlt, aber das Korrekturlesen abgeschlossen ist unabhängig davon ob das Tagging bereits gecheckt wurde oder nicht. Sortierung wäre hier nach Relevanz, sodass wichtige News zuerst gecheckt werden. Die Relevanz wäre ein Mix aus Veröffentlichungsdatum (älter = höher) und deren Kategorien.

z.B. wenn bei einem Artikel das "Korrekturlesen" abgehakt wurde, und danach mehrere Änderungen gemacht wurden um die Fakten für den "Faktencheck" zu korrigieren, werden alle Textstellen farblich hervorgehoben, die seit dem letzten "Korrekturlesen" geändert wurden.

- Es können Feeds abgerufen werden mit beliebigen Kategorien und Relevanzwerten. Es werden alle Neuigkeiten zurückgegeben die mindestens eine gegebene Kategorie mit gleich oder höherer Relevanz haben

z.B. ein Feed wie `?order_by=publishing_date&categories=science-10,astronomy-8` richtet sich an Leute die sich nur für wirkliche Durchbrüche in der Wissenschaft und sehr wichtige Neuigkeiten in der Astronomie interessieren und darin würde der Beispielartikel nicht auftauchen, bei Astronomie-3 wäre der Feed für Leute die sich nur für wirkliche Durchbrüche in der Wissenschaft aber speziell im Thema Astronomie für fast jegliche Neuigkeiten interessieren und der Beispielartikel würde zurückgegeben werden.

- Feeds haben verschiedene Darstellungsformen. JSON, HTML und RSS sollten als erstes berücksichtigt werden
- Artikel können zusätzliche Media Dateien angehängt haben, z.B. alle verwendeten Bilder, .mp3 Datei als TTS. Jede Media Datei hat dann auch eine eigene Quality Gate Markierung und die Neuigkeit selbst könnte ein `medias` Quality Gate haben das abgehakt wird sobald alle Medien gecheckt wurden

## KI kann unterstützen bei

- Der Findung von Kategorien und deren Hierarchie
- Vorchecks für die Qualitygates
    - "Korrekturlesen": Welche Rechtschreibfehler gibt es oder welche Sätze sollten wegen der Grammatik geändert werden
    - "Faktencheck" es werden alle Stellen ermittelt, die Fakten haben und hervorgehoben und es werden Quellen herausgesucht, die die Fakten bestätigen oder wiederlegen
    - "Kategorien": Zu jeder Kategorie werden Textstellen hervorgehoben, welche zu dieser Einschätzung geführt haben
- Automatischen taggen von Neuigkeiten

## Meilensteine

1. Neuigkeiten kommen rein und feeds können ausgegeben werden
- Alle Neuigkeiten werden gespeichert
- Es gibt ein Feed Endpunkt, der alle Neuigkeiten zurückgibt

2. Tagging der Kategorien
2.1 Informationen an der Neuigkeit und Feed Query
- Neuigkeiten können mit Tags von Kategorien und Relevanz versehen werden
- Der Feed kann per `?order_by=publishing_date&categories=<category1>-<relevance1>,<category2>-<relevance2>` gefiltert werden, die angegebene Relevanz wird immer als gleich oder größer gefiltert
- KI Workflow der das Tagging für alle News beim eingehen übernimmt

3. Quality Gates
3.1 Informationen an der Neuigkeit und Freigabe
- Informationen welche es gibt und welche davon abgehakt wurden werden am Artikel angegeben
- Der Feed kann per `?order_by=relevance&qualitygates=<qualitygate1>-<true/false>,<qualitygate2>-<true/false>` gefiltert werden
- Sobald ein Quality Gate mit `false` angegeben wird, werden auch noch nicht freigegebene Artikel zurückgegeben
- Nur wenn alle Quality Gates abgehakt sind, ist die Neuigkeit freigegeben und in allen Feeds verfügbar

## Weitere optionale Funktionen

- RAG Suche via `?query="Bilder von Exoplaneten"`
