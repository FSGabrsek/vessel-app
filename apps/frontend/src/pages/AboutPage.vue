<template>
    <h1>Vessel</h1>
    <p>Vessel is a webapp that makes it easy to track all media you're watching, reading, or planning to watch in the future. On Vessel you can add pieces of media to your personal list, organise them by type, provide them with a description, track your progress by episode or minute and leave a review to share with your friends when you're done.</p>
    <h2>Datamodel</h2>
    <p>Vessel uses a simple datamodel to store the media you and others watch.</p>
    <img src="../assets/Data model ERD.svg" alt="Datamodel entity relationship diagram"/>
    <h3>Watch</h3>
    <p>Watches are the core of vessel's data structure. Souls represent an individual user's interactions with a piece of media. It stores the current progress as a number and based on the progress in relation to the media's total length it calculates a measure 'Status'. This indicates whether the media is 'Finished',  'In Progress' or 'Not Watched'.</p>
    <p>Watches must belong to a vessel via a 0 or many to 1 relation and Users watch souls via a 1 to 0 or many relation. Watches are graded by reviews, which they store via a 1 to 0 or 1 relation.</p>
    <h3>Review</h3>
    <p>Users can rate Vessels by leaving reviews. Reviews have a rating (either <b>+</b>, <b>-</b> or <b>~</b>) and a content field for a more detailed description.</p>
    <h3>Vessel</h3>
    <p>Whereas watches are an individual user's expirience with a piece of media, vessels represent the media itself. Vessels store whether they are a series, a film or literature as 'Type'. A vessel also stores a title, synopsis and it's length. For vessels that have not been completely released, length is split into a current length and an eventual final length. Whether the media is upcoming, currently airing or finished is stored in as 'status'. Finally, the vessel stores its release date, and how often new parts are released as as an interval of days.</p>
    <p>Only the original creator of a vessel is allowed to edit its data, so the vessel's owner is stored in a 1 to 0 or many relation from a user to vessels. Any user can start watching a vessel if they like it, so to preserve the vessel they started watching, titles and synopsises can't be changed later on.</p>
    <h3>User</h3>
    <p>Users of vessel are represented as user entities. A user's username and password are stored in addition to an email adress for authentication and a date of birth.</p>
    <p>Users can follow other users to see their vessels. Following is represented as a 0 or many relation from the user entity to itself.</p>
    <h2>User Stories</h2>
    <h3>Add vessels to my list</h3>
    <p>As a user I want to create a vessel with various details about a piece of media and add it to my list so I can later view or edit the details</p>
    <ul>
        <li>Users can input media details.</li>
        <li>Users can save a new vessel and it appears on their personal list.</li>
        <li>Users add vessels created by other poeple save a new vessel and they appears on their personal list with a reference to the original creator.</li>
        <li>Users can edit vessel details after it has been added.</li>
    </ul>

    <h3>View progress</h3>
    <p>As a user I want to track and update the progress on every vessel on my list</p>
    <ul>
        <li>Users can view progress status as a number indicating length out of final length for each vessel.</li>
        <li>Users can update the progress status at any time.</li>
        <li>Progress updates are saved and reflected immediately in the list view.</li>
    </ul>

    <h3>Review vessels</h3>
    <p>As a user I want to write reviews on vessels on my list that I can later view or edit</p>
    <ul>
        <li>Users can write and save a review for any vessel on their list.</li>
        <li>Users can view reviews embedded in the vessel information</li>
        <li>Users can edit or delete previously written reviews.</li>
    </ul>

    <h3>Follow friends</h3>
    <p>As a user I want to follow other users so I can view their lists and add their vessels to my list</p>
    <ul>
        <li>User can view a followed user's list of vessels.</li>
        <li>User can add vessels from a friend's list to their own list.</li>
        <li>Users can follow other users from a vessel page.</li>
    </ul>
</template>