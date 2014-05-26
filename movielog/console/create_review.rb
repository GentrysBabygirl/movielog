module Movielog
  #
  # Namespace for movielog console use-cases.
  #
  module Console
    #
    # Responsible for providing a command-line interface to create new reviews.
    #
    class NewReview
      class << self
        #
        # Responsible for processing a new review command.
        #
        # @return [String] The full path to the new entry.
        def call
          loop do
            title, display_title = get_title
            review_hash = {
              title: title,
              display_title: display_title
            }

            file = Movielog::App.create_review(review_hash)

            puts "\n Created Review ##{bold(review_hash[:number].to_s)}!\n" +
            " #{bold('        Title:')} #{review_hash[:title]}\n" +
            " #{bold('Display Title:')} #{review_hash[:display_title]}\n" +
            " #{bold('         Date:')} #{review_hash[:date]}\n"

            exec "open #{file}"
          end
        end

        private

        def bold(text)
          term = Term::ANSIColor
          term.cyan text
        end

        #
        # Resposible for getting the date from the user.
        #
        # @param terminal [HighLine] The current HighLine instance.
        # @param db [MovieDb::Db] A MovieDb::Db instance.
        # @param title [String] The chosen title.
        #
        # @return [String] The chosen title.
        def get_title(title = nil, display_title = nil)
          while title.nil?
            query = Ask.input 'Title'
            results = Movielog::App.search_for_viewed_title(query)
            choices = format_title_results(results)
            choices << 'Search Again'
            idx = Ask.list(" Title", choices)

            unless idx == results.length
              title = results[idx].title
              display_title = results[idx].display_title
            end
          end

          [title, display_title]
        end

        def format_title_results(results)
          results.map do |movie|
            [
              movie.display_title,
              headline_cast(movie.title),
              aka_titles(movie.title),
              "\n"
            ].join
          end
        end

        def aka_titles(title)
          aka_titles = Movielog::App.aka_titles_for_title(title)
          return unless aka_titles.any?

          "\n   " + aka_titles.map { |aka_title| "aka #{aka_title.aka_title}" }.join("\n   ")
        end

        def headline_cast(title)
          headline_cast = Movielog::App.headline_cast_for_title(title)
          return unless headline_cast.any?
          "\n   " + headline_cast.map do |person|
            "#{person.first_name} #{person.last_name}"
          end.join(', ')
        end
      end
    end
  end
end