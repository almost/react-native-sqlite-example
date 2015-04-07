var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  ListView
} = React;

var SQLite = require('react-native-sqlite');

var Artists = React.createClass({
  render: function () {
    return (
      <View style={styles.wrapper}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this._renderArtist}
          />
      </View>
    );
  },

  getInitialState: function () {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return {
      dataSource: ds
    };
  },

  componentDidMount: function () {
    var artists = [];
    database.executeSQL(
      "SELECT Artist.ArtistId, Artist.Name, count(DISTINCT Album.AlbumId) as AlbumCount, count(DISTINCT Track.TrackId) as TrackCount FROM Artist " +
        "JOIN Album ON Album.ArtistId = Artist.ArtistId " +
        "JOIN Track ON Track.AlbumId = Album.AlbumId " +
        "GROUP BY Artist.ArtistId " +
        "ORDER BY Artist.Name ",
      [],
      (row) => {
        artists.push(row);
      },
      (error) => {
        if (error) {
          throw error;
        } else {
          this.setState({dataSource: this.state.dataSource.cloneWithRows(artists)});
        }
      });
  },

  _renderArtist: function (artist) {
    return (
      <TouchableHighlight onPress={() => this._selectArtist(artist)}>
        <View style={styles.artist}>
          <Text style={styles.artistName}>{artist.Name}</Text>
          <Text style={styles.artistStats}>{artist.AlbumCount} albums, {artist.TrackCount} songs</Text>
          <View style={styles.seperator}/>
        </View>
      </TouchableHighlight>
    );
  },

  _selectArtist: function (artist) {
    this.props.navigator.push({
      title: artist.Name,
      component: Artists
    });
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    flex: 1
  },
  seperator: {
    height: 1,
    backgroundColor: 'black'
  },
  artistName: {
    marginLeft: 10,
    marginTop: 10
  },
  artistStats: {
    marginLeft: 10,
    marginBottom: 10,
    fontStyle: 'italic',
    fontSize: 10
  }
});

module.exports = Artists;
