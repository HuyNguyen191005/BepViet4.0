<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
public function up()
{
    Schema::create('comments', function (Blueprint $table) {
        $table->id('comment_id'); // Khóa chính
        $table->unsignedBigInteger('user_id');
        $table->unsignedBigInteger('post_id'); // Liên kết với bài viết (Blog)
        $table->text('content');
        $table->unsignedBigInteger('parent_id')->nullable(); // Để trả lời bình luận
        $table->timestamps();

        // Khóa ngoại
        $table->foreign('user_id')->references('user_id')->on('users')->onDelete('cascade');
        $table->foreign('post_id')->references('post_id')->on('posts')->onDelete('cascade');
        $table->foreign('parent_id')->references('comment_id')->on('comments')->onDelete('cascade');
    });
}

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('comments');
    }
};
