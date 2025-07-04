---
layout: post
title: Autopublish WordPress posts after an interval of silence
categories:
  - name: programming
    relevance: 7
    reasoning: >-
      Der Text beschreibt eine technische Lösung mit einem CronScript, das über
      die WordPress API arbeitet und konkrete Programmierkonzepte wie
      API-Nutzung, Cronjobs und GitHub-Repository erwähnt.
  - name: work
    relevance: 6
    reasoning: >-
      Die Lösung zielt darauf ab, den Arbeitsaufwand für Blogger zu reduzieren,
      indem sie das manuelle Planen von Posts eliminiert und eine automatisierte
      Pipeline für die Veröffentlichung schafft.
  - name: ai
    relevance: 2
    reasoning: >-
      Obwohl der Text Automatisierung behandelt, handelt es sich um einfache
      zeitbasierte Automatisierung ohne KI-Komponenten - nur ein Cronjob, der
      Daten prüft und Posts veröffentlicht.
---

Having periodically posts without much effort is easy to reach with the WordPress API. I will describe here what's the use case and which solution I use.

<!--more-->

## The problem of scheduled publishing

WordPress already have a feature for automatic publish posts in the future. But scheduling has a great disadvantage: I must define the date manually in every post. If a new post is finished I must show when the last post will be published and schedule the finished days after that. If I want to publish spontaneously a post I have more posts in the time or must reschedule all posts with new dates.

## Flexible periodically publishing

But what I want is:

* I will write posts and if they are finished and can be published I want to add them into a pipeline or spontaneously publish
* If I don't publish a post for days the next post in the pipeline should automatic published

The solution is simple reachable with the WordPress API. A script running per CronJob check the date of the last published post and publish the next in the pipeline if its needed. The pipeline are all posts with a specific status (e.g. "pending").

The CronScript for this is available on GitHub:
[https://github.com/dragonprojects/wordpress-autopublish](https://github.com/dragonprojects/wordpress-autopublish)

## Summary

With this simple CronScript its possible to write posts without thinking about the publishing and have always an up to date blog.
