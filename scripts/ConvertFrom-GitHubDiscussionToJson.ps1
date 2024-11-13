# Use https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens to create a PAT
if (Get-Module -ListAvailable -Name PSGraphQL) {
    Import-Module -Name PSGraphQL, PSParseHTML
}
else {
    throw "Could not find module GitHub installed.  You need to: Install-Module GitHub"
}
$url = "https://api.github.com/graphql"

if ($env:JBOLDUAN_PAT) {
    $TOKEN = $env:JBOLDUAN_PAT

    $PSVersionTable
}
elseif (Test-Path C:\temp\mytoken.txt) {
    $TOKEN = Get-Content -Path C:\temp\mytoken.txt
}
else {
    $TOKEN = Get-Content -Path /mnt/c/temp/mytoken.txt
}

if ($null -eq $TOKEN -or $TOKEN -eq "") {
    "TOKEN IS EMPTY FOR SOME REASON"
}

$discussionsQuery = '
query {
  repository(owner:"jbolduan", name:"trumpwont.com") {
    discussions(first: 10, categoryId: "DIC_kwDONOWonc4CkNhJ", orderBy: {field:CREATED_AT, direction: ASC}{cursor}) {
      nodes {
        id
        title
        bodyHTML
        url
        labels(first: 10) {
          nodes {
            name
          }
        }
      }
      pageInfo {
        endCursor
        startCursor
        hasNextPage
        hasPreviousPage
      }
    }
  }
}'

$requestHeaders = @{
    Authorization = "bearer $TOKEN"
}

[System.Collections.ArrayList]$discussions = @()
$cursor = ""
do {
    $results = Invoke-GraphQLQuery -Query $DiscussionsQuery.Replace("{cursor}", $cursor) -Uri $url -Headers $requestHeaders

    if ($null -ne $results.data.repository.discussions.pageInfo.endCursor -or $results.data.repository.discussions.pageInfo.endCursor -ne "") {
        $cursor = ", after: `"$($results.data.repository.discussions.pageInfo.endCursor)`""
    }

    $discussions.Add($results)
} until(-not $results.data.repository.discussions.pageInfo.hasNextPage)

# Build Promises section of Json Object
[System.Collections.ArrayList]$promises = @()
foreach ($discussion in $discussions.data.repository.discussions.nodes) {
    if ("production" -in $discussion.labels.nodes.name) {
        $parsedHtml = $discussion.bodyHTML | ConvertFrom-Html
        $section = ""
        $description = ""
        $status = ""
        $status_info = ""
        $category = ""
        [System.Collections.ArrayList]$sources = @()
        foreach ($line in $parsedHtml.ChildNodes.InnerText) {
            if ($line -eq "Description") {
                $section = "description"
            }
            elseif ($line -eq "What is the current status of this promise?") {
                $section = "status"
            }
            elseif ($line -eq "Status Description") {
                $section = "status_info"
            }
            elseif ($line -eq "Category") {
                $section = "category"
            }
            elseif ($line -eq "References (URLs)") {
                $section = "sources"
            }
            else {
                if ($section -eq "description" -and $line -ne "Description" -and $line -notmatch "\n") {
                    $description += $line
                }
                elseif ($section -eq "status" -and $line -ne "What is the current status of this promise?" -and $line -notmatch "\n") {
                    $status += $line
                }
                elseif ($section -eq "status_info" -and $line -ne "Status Description" -and $line -notmatch "\n") {
                    $status_info += $line
                }
                elseif ($section -eq "category" -and $line -ne "Category" -and $line -notmatch "\n") {
                    $category += $line
                }
                elseif ($section -eq "sources" -and $line -ne "References (URLs)") {
                    if ($null -ne $line -and $line -ne "" -and $line -ne "`n") {
                        $sources.AddRange($line.Split("`n"))
                    }
                }
            }
        }
        $null = $promises.Add([PSCustomObject][ordered]@{
                title       = $discussion.title.Substring(10)
                description = $description
                status      = $status
                status_info = $status_info
                category    = $category
                comments    = $discussion.url
                sources     = $sources.ToArray()
            })
    }
}

# Build Json
[pscustomobject]$data = [ordered]@{
    icons    = [ordered]@{
        "First 24 Hours"     = "clock"
        "First 100 Days"     = "calendar"
        "Culture"            = "music"
        "Economy"            = "dollar-sign"
        "Environment"        = "leaf"
        "Government"         = "university"
        "Immigration"        = "suitcase"
        "Indigenous"         = "users"
        "Security"           = "fighter-jet"
        "Health"             = "heart"
        "World"              = "globe"
        "Education"          = "graduation-cap"
        "Energy"             = "lightbulb"
        "Appointee Promise"  = "person"
        "Republican Promise" = "republican"
        "Influencer Promise" = "trash"
    }
    statuses = [ordered]@{
        "Not started" = [ordered]@{
            "color" = "info"
            "icon"  = "hourglass-start"
        }
        "In progress" = [ordered]@{
            "color" = "warning"
            "icon"  = "cogs"
        }
        "Achieved"    = [ordered]@{
            "color" = "success"
            "icon"  = "check-circle"
        }
        "Broken"      = [ordered]@{
            "color" = "danger"
            "icon"  = "ban"
        }
        "Compromised" = [ordered]@{
            "color" = "compromised"
            "icon"  = "handshake"
        }
    }
    promises = $promises.ToArray()
}

$data | convertto-json -Depth 10 -Compress | Set-Content -Path ".\_data\data.json"
