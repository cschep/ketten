module SongbooksHelper
  def sort_link(songbook_id, column:, label:)
    direction = column == params[:column] ? next_direction : "asc"
    link_to(label, songbook_path(songbook_id, column:, direction:))
  end

  def next_direction
    params[:direction] == "asc" ? "desc" : "asc"
  end
end
