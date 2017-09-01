/**
 * Кадрирование фотографии
 * @type {{cropCoordinates: string, init: crop.init}}
 */
var crop = {
    /**
     * Координаты выделенной области при кадрировании фотографии
     */
    cropCoordinates: '',

    init: function () {
        /**
         * Передача оригинальной фотографии на сервер
         * и отображение ее в модальном окне
         * для последующего кадрирования
         */
        $(document).on('change', '#load-photo', function (e) {
            e.preventDefault();
            var fd = new FormData();
            fd.append('avatar', $('#load-photo')[0].files[0]);

            /**
             * AJAX запрос на сервер для передачи фотографии
             *
             * Request payload:
             * ------WebKitFormBoundarypD4Qszf05AAIPzCi
             * Content-Disposition: form-data; filename="photo_name.jpg"
             * Content-Type: image/jpeg
             * ------WebKitFormBoundarypD4Qszf05AAIPzCi--
             *
             * Ожидается JSON ответ от сервера:
             * В случае успеха:
             * {
             *  success: true,
             *  photo: path_to_loaded_photo
             * }
                     *
                     * В случае ошибки:
                     * {
             *  success: false,
             *  errors: errors_description
             * }
             */
            $.ajax({
                type: 'POST',
                url: 'path_to_url', // УРЛ для загрузки оригинальной фотографии
                data: fd,
                processData: false,
                contentType: false,
                cache: false,
                dataType: 'json',
                success: function (data) {
                    if (data.success === true) {
                        /**
                         * Показ модального окна и отображения в нем оригинальной фотографии
                         */
                        $('#loadPhotoModal').modal('show');
                        $('.loaded-photo').children().remove();
                        $('.loaded-photo').append('<img id="crop-target" src="' + data.photo + '" alt="">');

                        /**
                         * Вызов плагина кадрирования
                         */
                        $('#crop-target').Jcrop({
                            onSelect: function (c) {
                                crop.cropCoordinates = c
                            },
                            setSelect: [200, 200, 50, 50],
                            aspectRatio: 1 / 1,
                            boxWidth: 500,
                            minSize: [200, 200]
                        });
                    } else {
                        console.log(data.errors);
                    }
                },
                error: function (errors) {
                    console.log(errors);
                }
            });
        });

        /**
         * Передача на сервер координат, ширины и высоты кадрирования для оригинальной фотографии
         * и отображение ее в контейнере на странице портала
         */
        $(document).on('click', '#cropped-photo-load', function (e) {
            /**
             * AJAX запрос на сервер для загрузки кадрированной фотографии
             *
             * Form data:
             * - путь до оригинальной фотографии
             * photo: path_to_original_photo
             *
             * - координаты кадрирования
             * cx:186
             * cy:51
             * cx2:336
             * cy2:201
             *
             * - ширина и высота кадрированной области
             * cw:150
             * ch:150
             *
             * Оригинальная фотография кадрируется на сервере по переданным координатам, ширине и высоте
             *
             * Ожидается JSON ответ от сервера:
             * В случае успеха:
             * {
             *  success: true,
             *  photo: path_to_cropped_photo
             * }
             *
             * В случае ошибки:
             * {
             *  success: false,
             *  errors: errors_description
             * }
             */
            $.ajax({
                type: 'POST',
                url: 'path_to_url', // УРЛ для загрузки кадрированной фотографии
                dataType: 'json',
                cache: false,
                data: {
                    'photo': $('#crop-target').attr('src'),
                    'cx': crop.cropCoordinates.x,
                    'cy': crop.cropCoordinates.y,
                    'cx2': crop.cropCoordinates.x2,
                    'cy2': crop.cropCoordinates.y2,
                    'cw': crop.cropCoordinates.w,
                    'ch': crop.cropCoordinates.h
                },
                success: function (data) {
                    if (data.success === true) {
                        /**
                         * Сокрытие модального окна и отображение кадрированной фотографии
                         */
                        $('#loadPhotoModal').modal({
                            show: 'false'
                        });
                        $('#cropped-photo-container img').attr('src', '/' + data.photo);
                    } else {
                        console.log(data.errors);
                    }
                },
                error: function (errors) {
                    console.log(errors);
                }
            });
        });
    }
};
crop.init();
