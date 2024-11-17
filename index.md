---
layout: home
---
{% assign promises = site.data.data.promises %}
{% assign icons = site.data.data.icons %}
{% assign statuses = site.data.data.statuses %}
{% assign total = promises | size %}

{% assign categories = promises | map: 'category' | uniq %}

<div class="container-fluid promises-header page-header" id="promises-header">
    <div class="row">
        <div class="col-4">
            <div class="card">
                <div class="card-header">
                    Site Stats
                </div>
                <div class="card-header">
                    <ul class="list-group">
                        <li class="list-group-item">
                            <i class="fa fa-home fa-fw"></i>
                            <b id="inauguration-time">Days Till Inauguration: <span id="inaguration-days"><i
                                        class="loading">Loading...</i></span></b>
                        </li>
                        <li class="list-group-item">
                            <i class="fa fa-calendar fa-fw"></i>
                            <b>Days In Office: <span id="days-in-office"><i class='loading'>Loading...</i></span></b>
                        </li>
                        <li class="list-group-item">
                            <i class="fa fa-calendar fa-fw"></i>
                            <b>Days Since Election: <span id="days-since-election"><i
                                        class='loading'>Loading...</i></span></b>
                        </li>

                        {% for status in statuses %}
                        {% assign status_name = status[0] %}
                        {% assign status_data = status[1] %}
                        <li class="list-group-item list-group-item-{{ status_data['color'] }}">
                            <i class="fa fa-fw fa-{{ status_data['icon'] }}"></i>
                            {{ status_name }}: <span class="active-points">{{ promises | where: "status",status_name |
                                size
                                }}</span> of <span class="total-points">{{ total }}</span>
                        </li>
                        {% endfor %}
                    </ul>
                </div>
            </div>
        </div>
        <div class="col-8">
            <div class="card">
                <div class="card-header">
                    About The Site
                </div>
                <div class="card-body">
                    <p>This website is to track all the promises made by Donald Trump, Republican politicians, and
                        conservative
                        influencers.
                        The intention is to identify what was followed through on, what was not, and what was an
                        outright lie.
                        This is a
                        collaborative effort and you can participate by using the <a
                            href="https://github.com/jbolduan/didtrumpdoit.com">GitHub
                            repository</a> either directly by contributing changes to the <a
                            href="https://github.com/jbolduan/didtrumpdoit.com/blob/master/_data/data.json">data.json</a>
                        file or
                        through
                        opening issues/discussions to have others add or update items.</p>
                    <p>This site was created by the <a href="https://destiny.gg">destiny.gg</a> community.</p>

                    <div id="share-buttons" class="text-center">
                        <ul class="list-inline">
                            <li class="list-inline-item">
                                <a href="https://www.facebook.com/sharer.php?u=https://didtrumpdoit.com" target="_blank"
                                    style="color:#3b5998; text-align: center;">
                                    <i class="fa-brands fa-2x fa-facebook-square"></i><br />Share on Facebook
                                </a>
                            </li>
                            <li class="list-inline-item">
                                <a href="https://x.com/share?url=https://didtrumpdoit.com/" target="_blank"
                                    style="color:#1da1f2; text-align: center;">
                                    <i class="fa-brands fa-2x fa-x-twitter"></i><br />Share on X
                                </a>
                            </li>
                            <li class="list-inline-item">
                                <a href="http://www.reddit.com/submit?url=https://didtrumpdoit.com&title=DidTrumpDoIt.com"
                                    target="_blank" style="color:#ff5700; text-align: center;">
                                    <i class="fa-brands fa-2x fa-reddit"></i><br />Share on Reddit
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<br />
<div class="container-fluid promises" id="promises">
    <div class="row promises__search-row">
        <div class="col-md-5">
            <form action="#" class="form-inline">
                <input id="search" type="text" class="form-control search" placeholder="Search">
                <button class="promises__category--reset btn btn-primary">
                    <i class="fa-solid fa-fw fa-arrows-rotate"></i>Clear
                    <i class="fa-solid fa-fw fa-filter"></i><span id="count">{{ total }}</span>/{{ total }}
                </button>
            </form>
            <br />
        </div>
        <div class="col-md-7" id="center-on-mobile">
            <div class="pull-right">
                {% for status in statuses %}
                {% assign status_name = status[0] %}
                {% assign status_data = status[1] %}

                <button class="btn btn-{{ status_data['color'] }}" data-list-facet="js-promise-status"
                    data-facet-value="{{ status_name }}" data-select-single="true">
                    <i class="fa fa-{{ status_data['icon'] }} fa-fw" aria-hidden="true"></i>
                    <span class="remove-on-mobile">{{ status_name }}</span>
                </button>
                {% endfor %}
            </div>
        </div>
    </div>

    <div class="container-fluid">
        <div class="row">
            <ul class="nav nav-tabs" id="myTabs" role="tablist">
                {% for category in categories %}
                <li role="presentation" data-list-facet="js-promise-category" data-facet-value="{{ category }}"
                    class="nav-item {{ category }}">
                    <a href="#" role="tab" data-bs-toggle="tab" class="nav-link active">
                        <i class="fa fa-fw fa-{{ icons[category] }}"></i>&nbsp;
                        <span class="remove-on-mobile">{{ category }}</span>
                    </a>
                </li>
                {% endfor %}
            </ul>
        </div>

        <div class="row">
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th></th>
                        <th>Promise</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody class="list">
                    {% for promise in promises %}
                    <tr class="promise {% if promise.status == 'In progress' %}table-warning{% endif %}{% if promise.status == 'Achieved' %}table-success{% endif %}{% if promise.status == 'Broken' %}table-danger{% endif %}{% if promise.status == 'Compromised' %}table-info{% endif %}"
                        onclick="toggler('div{{ forloop.index}}')">
                        <td class="fit">{{ forloop.index }}.</td>
                        <td class="js-promise-text">
                            <b><span class="js-promise-category">{{ promise.category }}</span>:</b>
                            <span class="js-promise-status sr-only">{{ promise.status }}</span>
                            {{ promise.title }}
                            {% for source in promise.sources %}
                            <sup><a href="{{ source }}">{{ forloop.index }}</a></sup>
                            {% endfor %}
                            <div id="div{{ forloop.index }}" class="hidden">
                                <span class="">{{ promise.description }}</span><br />
                                <sub><b>{{ promise.status_info }}</b></sub>
                            </div>
                        </td>
                        <td class="fit">
                            <a href="{{ promise.comments }}" target="_blank" rel="nofollow">
                                <i class="fa fa-fw fa-comments" aria-hidden="true"></i>
                            </a>
                        </td>
                    </tr>
                    {% endfor %}
                </tbody>
            </table>
        </div>
    </div>
</div>
