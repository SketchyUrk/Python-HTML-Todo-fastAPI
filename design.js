fetch("tasks.json")
.then (response =>
{
    if (!response.ok) throw new Error ('HTTP Error! Status: ${response.status}');
    return response.json();
}
)