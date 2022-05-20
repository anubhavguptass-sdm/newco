# Require any additional compass plugins here.

# Change this to :production when ready to deploy the CSS to the live server.
# environment = :production
# environment = :development

# Set this to the root of your project when deployed:
http_path = "../../"
css_dir = "css/"
sass_dir = "sass/"
images_dir = "assets/img/"
javascripts_dir = "js/"
cache = false

# Fixes issue with sass-cache folder created inside svn folder
# cache_dir = "../../../../../../../../.sass-cache" #not a nice solution but it works for a moment
cache_path = "C:/Temp/.sass-cache" # this works in windows
cache = true

# Fixes issue with different path on local and production coused by all.css file
# http_path = (environment == :development) ? "/" : "../../"

# You can select your preferred output style here (can be overridden via the command line):
# output_style = (environment == :development) ? :expanded : :compressed

# To enable relative paths to assets via compass helper functions. Uncomment:
# relative_assets = (environment == :development) ? true : false

# To disable debugging comments that display the original location of your selectors. Uncomment:
# line_comments = (environment == :development) ? true : false



# To disable adding hash in the resources
asset_cache_buster :none

# Make a copy of sprites with a name that has no uniqueness of the hash.
on_sprite_saved do |filename|
  if File.exists?(filename)
    FileUtils.cp filename, filename.gsub(%r{-s[a-z0-9]{10}\.png$}, '.png')
    # Note: Compass outputs both with and without random hash images.
    # To not keep the one with hash, add: (Thanks to RaphaelDDL for this)
    FileUtils.rm_rf(filename)
  end
end
 
# Replace in stylesheets generated references to sprites
# by their counterparts without the hash uniqueness.
on_stylesheet_saved do |filename|
  if File.exists?(filename)
    css = File.read filename
    File.open(filename, 'w+') do |f|
      f << css.gsub(%r{-s[a-z0-9]{10}\.png}, '.png')
    end
  end
end

# If you prefer the indented syntax, you might want to regenerate this
# project again passing --syntax sass, or you can uncomment this:
# preferred_syntax = :sass
# and then run:
# sass-convert -R --from scss --to sass sass scss && rm -rf sass && mv scss sass
