require 'csv'
require 'json'
require 'set'

class DiseaseGenerator

  PRESET = {
    "R51" => {
      icd10: "R51",
      name: "Headache",
      symptomIcds: ["R51"],
      relativeLikelihoods: Array.new(18, 5)
    },
    "C91.00" => {
      icd10: "C91.00",
      name: "Acute lymphoblastic leukemia [ALL]: Acute lymphoblastic leukemia not having achieved remission",
      symptomIcds: ["R50.80", "R50.88", "R50.9", "R53", "D61.9", "D61.8", "D61.3", "R59", "R23", "R51", "H53.8", "H53.9", "R19.7"],
      relativeLikelihoods: [1000000, 100000, 50000, 30000, 20000, 10000, 5000, 4000, 2000,
                            1000000, 100000, 50000, 30000, 20000, 10000, 5000, 4000, 2000]
    },
    "J10.1" => {
      icd10: "J10.1",
      name: "Influenza due to other identified influenza virus with other respiratory manifestations: Flu due to oth ident influenza virus w oth resp manifest",
      symptomIcds: ["R50.80", "R50.88", "R50.9", "R51", "R19.7"],
      relativeLikelihoods: Array.new(18, 50)
    },
    "J06.9" => {
      icd10: "J06.9",
      name: "Acute upper respiratory infections of multiple and unspecified sites: Acute upper respiratory infection, unspecified",
      symptomIcds: ["R50.80", "R50.88", "R50.9", "R51"],
      relativeLikelihoods: Array.new(18, 20)
    }
  }

  def self.generateDiseases
    symptoms = []
    common_symptoms = []
    counter = 0
    CSV.foreach(File.expand_path('icd10-codes.csv', __dir__), {}) do |row|
      symptoms << row
      common_symptoms << row if row[0].start_with?(/R/)
      counter += 1
      # break if counter > 20
    end
    diseases = []
    rnd = Random.new
    
    symptoms.each do |symptom|
      symptom_amount = rnd.rand(19) + 1 # 1 to 20 symptoms
      disease_symptom_icds = Set.new
      symptom_amount.times do 
        if rnd.rand(3) < 2
          disease_symptom_icds << common_symptoms[rnd.rand(common_symptoms.length)][0]
        else
          disease_symptom_icds << symptoms[rnd.rand(symptoms.length)][0]
        end  
      end
      if PRESET[symptom[0]]        
        diseases << PRESET[symptom[0]]
      else
        diseases << {
          icd10: symptom[0],
          name: symptom[1],
          symptomIcds: disease_symptom_icds.to_a,
          relativeLikelihoods: getRelativeLikelihoods(symptom[0])
        }
      end
      
    end

    File.open(File.expand_path('diseases.json', __dir__),"w") do |f|
      f.write(JSON.pretty_generate(diseases) )
    end
  
  end

  LIKEHOOD_GROUPS = [
    10,
    20,
    30,
    40,
    50,
    60,
    70,
    80,
    90,
    100,
    200,
    300,
    400,
    500,
    750,
    1000,
    2000,
    3000,
    4000,
    5000,
    10000,
    20000,
    30000,
    40000,
    50000,
    100000,
    200000,
    500000,
    1000000,
    2000000,
    5000000,
    10000000,
    20000000,
    50000000,
    100000000
  ]

  AGE_GROUPS = [
    "0-2",
    "3-5",
    "6-13",
    "14-18",
    "19-33",
    "34-48",
    "49-64",
    "65-78",
    "79+"
  ]

  def self.getRelativeLikelihoods(code)
    rnd = Random.new

    base_likelihood = rnd.rand(AGE_GROUPS.length)
    base_agegroup = rnd.rand(AGE_GROUPS.length)

    age_disparrity = rnd.rand(5) 
    age_disparities = []
    AGE_GROUPS.each_with_index do |group, index|
     age_disparities[index] = age_disparrity == 0 ? (base_agegroup - index).abs : 0
    end


    occurs_for_men = true
    occurs_for_women = true
    men_offset = 0
    women_offset = 0
    gender_disparity = rnd.rand(10)

    occurs_for_men = false if code.start_with?(/O|N6|N7|N8/) # pregnancy, female genital
    occurs_for_women = false if code.start_with?(/N4|N5/) # male genital
    
    if occurs_for_women && occurs_for_men
      if gender_disparity == 0
        men_offset = rnd.rand(5) - 2;
      elsif gender_disparity == 1
        women_offset = rnd.rand(5) - 2;      
      end
    end
      
    likelihoods = []
    AGE_GROUPS.each_with_index do |group, index|
      if occurs_for_men
        likelihoods << LIKEHOOD_GROUPS[[0, [base_likelihood+men_offset+age_disparities[index], LIKEHOOD_GROUPS.length-1].min].max]
      else
        likelihoods << 0
      end
    end
    AGE_GROUPS.each_with_index do |group, index|
      if occurs_for_women
        likelihoods << LIKEHOOD_GROUPS[[0, [base_likelihood+women_offset+age_disparities[index], LIKEHOOD_GROUPS.length-1].min].max]
      else
        likelihoods << 0
      end
    end
    likelihoods
    
  end
end

DiseaseGenerator.generateDiseases
