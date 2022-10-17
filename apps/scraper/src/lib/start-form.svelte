<script lang="ts">
    import { enhance } from '$lib/actions/form';
    
    export let onStart: (resp: any) => void
</script>

<form action="/start" method="post" use:enhance={{ result: onStart }}>
    <div class="overflow-hidden shadow sm:rounded-md">
        <div class="bg-white px-4 py-5 sm:p-6">
            <div class="grid grid-cols-6 gap-6">

                <div class="col-span-6 sm:col-span-3">
                    <label for="interval" class="block text-sm font-medium text-gray-700">Interval in ms</label>
                    <input type="number" name="interval" id="interval" autocomplete="off" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                </div>

                <div class="col-span-6 sm:col-span-3">
                    <label for="current" class="block text-sm font-medium text-gray-700">current (page/manga/chapter)</label>
                    <input type="number" name="current" id="current" autocomplete="off" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                </div>

                <div class="col-span-6 sm:col-span-3">
                    <label for="country" class="block text-sm font-medium text-gray-700">Country</label>
                    <select id="country" name="country" autocomplete="country-name" class="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
                        <option value="manga">List manga</option>
                        <option value="chapters">List chapters</option>
                        <option value="update">Update chapters</option>
                    </select>
                </div>
                
            </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 text-right sm:px-6">
            <button type="submit" class="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">Save</button>
        </div>
    </div>
</form>