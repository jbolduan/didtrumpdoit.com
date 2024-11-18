---
layout: home
---
{% assign promises = site.data.data.promises %}
{% assign icons = site.data.data.icons %}
{% assign statuses = site.data.data.statuses %}
{% assign total = promises | size %}

{% assign categories = promises | map: 'category' | uniq | sort %}

<div class="container-fluid p-2">
    <div class="row">
        <div class="col-lg-4">
            <div class="card">
                <div class="card-header">
                    <b>2<sup>nd</sup> Term Stats</b>
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
        <div class="col-lg-8">
            <div class="card">
                <div class="card-header">
                    <b>About The Site</b>
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
                    {% assign socialDescription = site.description | cgi_escape %}
                    <div id="share-buttons" class="text-center">
                        <ul class="list-inline">
                            <li class="list-inline-item">
                                <a href="https://bsky.app/intent/compose?text={{ socialDescription }}%0Ahttps%3A//didtrumpdoit.com"
                                    target="_blank" style="color:#0085ff; text-align: center;"><i
                                        class="fa-brands fa-2x fa-bluesky"></i><br />Share on BlueSky</a>
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
                            <li class="list-inline-item">
                                <a href="https://www.facebook.com/sharer.php?u=https://didtrumpdoit.com" target="_blank"
                                    style="color:#3b5998; text-align: center;">
                                    <i class="fa-brands fa-2x fa-facebook-square"></i><br />Share on Facebook
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="container-fluid p-2">
    <div class="row">
        <div class="col-lg-6">
            <div class="card">
                <div class="card-header">
                    <b>Filter by Promise Type:</b>
                </div>
                <div class="card-body">
                    {% for category in categories %}
                    <input name="filterData" type="checkbox" class="btn-check" id="{{ category }}" autocomplete="off"
                        value="{{ category }}" checked>
                    <label class="btn btn-outline-primary mr-2 mb-2" for="{{ category }}">{{ category }}</label>
                    {% endfor %}
                </div>
            </div>
        </div>
        <div class="col-lg-6">
            <div class="card">
                <div class="card-header">
                    <b>Filter by Promise Status:</b>
                </div>
                <div class="card-body">
                    <form action="#" class="row">
                        <div class="col-sm-8">
                            <input id="search" type="text" class="form-control search mr-2 mb-2" placeholder="Search">
                        </div>
                        <div class="col-sm-4 mr-2 mb-2">
                            <button class="btn btn-primary" id="filterReset">
                                <i class="fa-solid fa-fw fa-arrows-rotate"></i>Clear
                                <i class="fa-solid fa-fw fa-filter"></i><span id="count">{{ total }}</span>/{{ total }}
                            </button>
                        </div>
                    </form>
                    <br />
                    {% for status in statuses %}
                    {% assign status_name = status[0] %}
                    {% assign status_data = status[1] %}
                    <input name="filterData" type="checkbox" class="btn-check" id="{{ status_name }}" autocomplete="off"
                        value="{{ status_name }}" checked>
                    <label class="btn btn-outline-{{ status_data['color'] }} mr-2 mb-2" for="{{ status_name }}"><i
                            class="fa fa-{{ status_data['icon'] }} fa-fw" aria-hidden="true"></i>
                        <span class="remove-on-mobile">{{ status_name }}</span></label>
                    {% endfor %}
                </div>
            </div>
        </div>
    </div>
</div>

<div class="container-fluid p-2">
    <div class="row">
        <div class="table-responsive">
            <table class="table table-hover table-bordered" id="dataTable">
                <thead>
                    <tr>
                        <th></th>
                        <th>Promise</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody class="list" id="promisesList">
                    {% for promise in promises %}
                    {% assign promiseSafeTitle = promise.title | cgi_escape %}
                    <!-- {% assign promiseSafeAnchor = promise.title | replace: ' ', '_' | replace: '"', "" %} Keeping this around in case it's useful in the future -->
                    {% assign promiseSafeAnchor = forloop.index %}
                    <tr class="promise {% if promise.status == 'In progress' %}table-warning{% endif %}{% if promise.status == 'Achieved' %}table-success{% endif %}{% if promise.status == 'Broken' %}table-danger{% endif %}{% if promise.status == 'Compromised' %}table-info{% endif %}"
                        onclick="toggler('div{{ forloop.index}}')">
                        <td class="fit">{{ forloop.index }}.</td>
                        <td>
                            <b><span>{{ promise.category }}</span>:</b>
                            <span class="sr-only">{{ promise.status }}</span>
                            <a id="{{ promiseSafeAnchor }}">{{ promise.title }}</a>
                            {% for source in promise.sources %}
                            <sup><a href="{{ source }}">{{ forloop.index }}</a></sup>
                            {% endfor %}
                            <div id="div{{ forloop.index }}" class="hidden">
                                <span class="">{{ promise.description }}</span><br />
                                <sub><b>{{ promise.status_info }}</b></sub>
                            </div>
                        </td>
                        <td class="fit">
                            <!-- Share this entry on X-->
                            <a href="https://x.com/share?text={{ promiseSafeTitle }}&url=https://didtrumpdoit.com/%23{{ promiseSafeAnchor }}"
                                target="_blank" style="color:#1da1f2;"><i class="fa-brands fa-fw fa-x-twitter"></i></a>

                            <!-- Share this entry on Reddit -->
                            <a href="http://www.reddit.com/submit?url=https://didtrumpdoit.com/%23{{ promiseSafeAnchor }}&title={{ promiseSafeTitle }}"
                                target="_blank" style="color:#ff5700;"><i class="fa-brands fa-fw fa-reddit"></i></a>

                            <!-- Share this entry on Facebook -->
                            <a href="https://www.facebook.com/sharer/sharer.php?u=https://didtrumpdoit.com/%23{{ promiseSafeAnchor }}"
                                target="_blank" style="color:#3b5998;"><i
                                    class="fa-brands fa-fw fa-facebook-square"></i></a>

                            <!-- Link directly to this entry -->
                            <a href="#{{ promiseSafeAnchor }}" rel="nofollow"><i class="fa fa-fw fa-link"
                                    aria-hidden="true"></i></a>

                            <!-- Link out to the comments hosted on GitHub -->
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
