require 'spec_helper'
require 'support/stub_template_context'

describe Movielog::Helpers do
  let(:context) { stub_template_context }
  describe '#description_for_review' do
    let(:review) { OpenStruct.new(display_title: 'Rio Bravo (1959)') }

    ('A'..'D').each do |letter|
      ['+', '', '-'].each do |modifier|
        grade = "#{letter}#{modifier}"
        context "when grade is #{grade}" do
          it 'returns an svg string' do
            svg = context.grade_to_svg_stars(grade: grade)
            expect(svg).not_to be_blank
          end
        end
      end
    end

    context 'when grade is F' do
      it 'returns an svg string' do
        svg = context.grade_to_svg_stars(grade: 'F')
        expect(svg).not_to be_blank
      end
    end

    context 'when grade is blank' do
      it 'returns an empty string' do
        expect(context.grade_to_svg_stars(grade: nil)).to eq('')
      end
    end
  end
end
