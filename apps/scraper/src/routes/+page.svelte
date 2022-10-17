<script lang="ts">
  import StartForm from '$lib/start-form.svelte';

  const onStart = (resp, form: HTMLFormElement) => {
    console.log('form submitted:', resp);
    form?.reset();
  };
</script>

<div class="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
  <div class="md:grid md:grid-cols-3 md:gap-6">
    <div class="md:col-span-1">
      <div class="px-4 sm:px-0">
        <h3 class="text-lg font-medium leading-6 text-gray-900">Start Aninga Bot</h3>
        <p class="mt-1 text-sm text-gray-600">Selete the configuration to start</p>
      </div>
    </div>
    <div class="mt-5 md:col-span-2 md:mt-0">
      <StartForm {onStart} />
    </div>
  </div>
</div>
