<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserLink extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'url',
        'icon',
        'click_count'
    ];

    protected $casts = [
        'click_count' => 'integer'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Accessor for count (alias for click_count)
    public function getCountAttribute()
    {
        return $this->click_count;
    }

    // Mutator for count (alias for click_count)
    public function setCountAttribute($value)
    {
        $this->click_count = $value;
    }
}
