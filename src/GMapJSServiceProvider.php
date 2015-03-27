<?php namespace rvadym\gmapjs;

use Illuminate\Support\ServiceProvider;

class GMapJSServiceProvider extends ServiceProvider {

	/**
	 * Bootstrap the application services.
	 *
	 * @return void
	 */
	public function boot()
	{
		$this->publishes([
			__DIR__.'/../public/assets' => public_path('packages/rvadym/gmapjs/assets')
		], 'assets');
	}

	/**
	 * Register the application services.
	 *
	 * @return void
	 */
	public function register()
	{
		//
	}

}
