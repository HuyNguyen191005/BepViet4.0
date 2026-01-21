<?php

// database/migrations/xxxx_create_forum_tables.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        // 1. Bảng Bài viết (Câu hỏi)
        Schema::create('forum_posts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Ai hỏi?
            $table->string('title'); // Tiêu đề
            $table->text('content'); // Nội dung
            $table->integer('views')->default(0); // Lượt xem
            $table->timestamps();
        });

        // 2. Bảng Bình luận (Trả lời)
        Schema::create('forum_comments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Ai trả lời?
            $table->foreignId('forum_post_id')->constrained('forum_posts')->onDelete('cascade'); // Trả lời bài nào?
            $table->text('content'); // Nội dung trả lời
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('forum_comments');
        Schema::dropIfExists('forum_posts');
    }
};