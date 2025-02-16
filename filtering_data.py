import pandas as pd

air_pollution = pd.read_csv('C:/Users/liepu/Desktop/Data_Visualisation/data/global_air_pollution_data.csv')

life_expectancy = pd.read_csv('C:/Users/liepu/Desktop/Data_Visualisation/data/life_expectancy_data.csv')

world_population = pd.read_csv('C:/Users/liepu/Desktop/Data_Visualisation/data/world_population.csv')


print("Air Pollution Data Preview:")
print(air_pollution.head())

print("\nAir Pollution Data Columns:")
print(air_pollution.columns)


print("\nLife Expectancy Data Preview:")
print(life_expectancy.head())

print("\nLife Expectancy Data Columns:")
print(life_expectancy.columns)


print("\nWorld Population Data Preview:")
print(world_population.head())

print("\nWorld Population Data Columns:")
print(world_population.columns)



air_pollution_filtered = air_pollution[['Country', 'aqi_value']]

life_expectancy_filtered = life_expectancy[['Country', 'Life expectancy ']]

world_population_filtered = world_population[['Country', '2022 Population']]


air_pollution_filtered = air_pollution_filtered.groupby('Country', as_index=False).mean()
life_expectancy_filtered = life_expectancy_filtered.groupby('Country', as_index=False).mean()
world_population_filtered = world_population_filtered.groupby('Country', as_index=False).mean()

merged_data = pd.merge(air_pollution_filtered, life_expectancy_filtered, on='Country', how='inner')
merged_data = pd.merge(merged_data, world_population_filtered, on='Country', how='left')


merged_data.dropna(inplace=True)


print("\nMerged Data Preview:")
print(merged_data.head())

print("\nMerged Data Description:")
print(merged_data.describe())

merged_data.to_csv('merged_data.csv', index=False)

print("\nData merged and saved as merged_data.csv")
