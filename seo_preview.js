$.fn.seoPreview = function(options) {
    var defaults = {
        platforms: ['google', 'facebook', 'twitter'],
        languages: ['tr', 'en'],
        variables: {
            '%site_title%': 'Site İsmi',
            '%site_title_en%': 'Site İsmi (İngilizce)',
            '%page_title%': 'Sayfa İsmi',
            '%page_title_en%': 'Sayfa İsmi (İngilizce)',
            '%category_title%': 'Kategori İsmi',
            '%category_title_en%': 'Kategori İsmi (İngilizce)',
            '%ayrac%': '|',
        },
        titleLimit: 60,
        descriptionLimit: 160
    };

    var settings = $.extend({}, defaults, options);

    return this.each(function() {
        var $this = $(this);

        settings.platforms.forEach(function(platform) {
            settings.languages.forEach(function(language) {

                var selectTitle = $('select[name="' + platform + '-type-title-' + language + '"]');
                var selectDescription = $('select[name="' + platform + '-type-description-' + language + '"]');
                var inputTitle = $('input[name="' + platform + '-title-' + language + '"]');
                var inputTitleReal = $('input[name="' + platform + '-title-' + language + '-real"]');
                var inputDescription = $('textarea[name="' + platform + '-description-' + language + '"]');
                var inputDescriptionReal = $('input[name="' + platform + '-description-' + language + '-real"]');
                var progressTitle = $('.' + platform + ' .lang-' + language + ' .progress.' + platform + '-title-' + language);
                var progressDescription = $('.' + platform + ' .lang-' + language + ' .progress.' + platform + '-description-' + language);
                var previewTitle = $('.' + platform + ' .lang-' + language + ' .preview .title');
                var previewDescription = $('.' + platform + ' .lang-' + language + ' .preview .description');
                var previewImage = $('.' + platform + ' .lang-' + language + ' .preview figure');
                var inputImage = $('input[name="' + platform + '-image-' + language + '"]');

                selectTitle.on('change', function() {
                    var value = $(this).val();
                    var inputValue = inputTitle.val();
                    inputTitle.val(inputValue + '' + value);
                    inputTitleReal.val(inputValue + '' + value);
                    inputTitle.focus();
                    manipulateInput();
                });

                inputTitle.on('input', function() {
                    var title = $(this).val();

                    // input
                    for (var key in settings.variables) {
                        if (settings.variables.hasOwnProperty(key)) {
                            title = title.replace(new RegExp(key, 'g'), settings.variables[key]);
                        }
                    }

                    inputTitleReal.val(title);
                    var progress = Math.min((title.length / settings.titleLimit * 100), 100);
                    progressTitle.css('width', progress + '%');
                    updateProgressBarColor(progressTitle, progress, settings.titleLimit);
                    previewTitle.text(title);
                });

                selectDescription.on('change', function() {
                    var value = $(this).val();
                    var inputDescriptionValue = inputDescription.val();
                    inputDescription.val(inputDescriptionValue + ' ' + value);
                    inputDescriptionReal.val(inputDescriptionValue + ' ' + value);
                    inputDescription.focus();
                    manipulateInputDescription()
                });

                inputDescription.on('input', function() {
                    var description = $(this).val();

                    for (var key in settings.variables) {
                        if (settings.variables.hasOwnProperty(key)) {
                            description = description.replace(new RegExp(key, 'g'), settings.variables[key]);
                        }
                    }

                    inputDescriptionReal.val(description);
                    var progress = Math.min((description.length / settings.descriptionLimit * 100), 100);
                    progressDescription.css('width', progress + '%');
                    updateProgressBarColor(progressDescription, progress, settings.descriptionLimit);
                    previewDescription.text(description);
                });

                inputImage.on('change', function(e) {
                    var file = e.target.files[0];
                    var reader = new FileReader();
                    reader.onload = function(e) {
                        previewImage.css('background-image', 'url(' + e.target.result + ')');
                    };
                    reader.readAsDataURL(file);
                });

                function manipulateInput() {
                    inputTitle.trigger('input');
                }

                function manipulateInputDescription() {
                    inputDescription.trigger('input');
                }

                function updateProgressBarColor(progressBar, progress, limit) {
                    progressBar.removeClass('bg-danger bg-warning bg-success');

                    if (progress >= 0 && progress < 40) {
                        progressBar.addClass('bg-danger');
                    }
                    if (progress >= 40 && progress < 70) {
                        progressBar.addClass('bg-warning');
                    }
                    if (progress >= 70 && progress <= 100) {
                        progressBar.addClass('bg-success');
                    }

                    if (progress == 100 && inputTitle.val().length > limit) {
                        progressBar.removeClass('bg-success').addClass('bg-danger');
                    }
                    if (progress == 100 && inputDescription.val().length > limit) {
                        progressBar.removeClass('bg-success').addClass('bg-danger');
                    }
                }
            });
        });
    });
};
