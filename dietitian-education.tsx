'use client';
import { useState } from 'react';
import Link from 'next/link';

const courses = [
  {
    id: 'gi-anatomy',
    title: 'GI Anatomy & Physiology',
    description: 'Comprehensive overview of digestive system anatomy and physiological processes',
    modules: 8,
    cme: 12,
    level: 'Core',
    duration: '3-4 hours',
    topics: ['Digestive anatomy', 'Gut physiology', 'Microbiome basics', 'Digestive enzymes']
  },
  {
    id: 'nutritional-assessment',
    title: 'Nutritional Assessment in GI Conditions',
    description: 'Evidence-based approaches to nutritional evaluation in gastroenterology',
    modules: 10,
    cme: 15,
    level: 'Core',
    duration: '4-5 hours',
    topics: ['Assessment tools', 'Malnutrition screening', 'Body composition', 'Biochemical markers']
  },
  {
    id: 'ibd-nutrition',
    title: 'IBD Nutrition Management',
    description: 'Specialized nutrition therapy for inflammatory bowel diseases',
    modules: 12,
    cme: 18,
    level: 'Advanced',
    duration: '5-6 hours',
    topics: ['Anti-inflammatory diets', 'Exclusive enteral nutrition', 'Micronutrient deficiencies', 'Surgery planning']
  },
  {
    id: 'liver-nutrition',
    title: 'Hepatic Nutrition Therapy',
    description: 'Nutrition management in liver diseases and hepatic encephalopathy',
    modules: 9,
    cme: 14,
    level: 'Advanced',
    duration: '4-5 hours',
    topics: ['Protein requirements', 'Branched-chain amino acids', 'Ascites management', 'Transplant nutrition']
  },
  {
    id: 'pediatric-gi',
    title: 'Pediatric GI Nutrition',
    description: 'Age-specific nutritional interventions for pediatric gastroenterology',
    modules: 11,
    cme: 16,
    level: 'Advanced',
    duration: '5-6 hours',
    topics: ['Growth assessment', 'Feeding disorders', 'Food allergies', 'Failure to thrive']
  },
  {
    id: 'enteral-nutrition',
    title: 'Enteral & Parenteral Nutrition',
    description: 'Clinical nutrition support in GI conditions',
    modules: 8,
    cme: 12,
    level: 'Core',
    duration: '3-4 hours',
    topics: ['Tube feeding', 'Formula selection', 'TPN indications', 'Complications management']
  },
  {
    id: 'functional-disorders',
    title: 'Functional GI Disorders',
    description: 'Dietary management of IBS, SIBO, and functional dyspepsia',
    modules: 7,
    cme: 10,
    level: 'Core',
    duration: '3-4 hours',
    topics: ['Low FODMAP diet', 'SIBO protocols', 'Stress-gut connection', 'Lifestyle modifications']
  },
  {
    id: 'pancreatitis-nutrition',
    title: 'Pancreatic Disease Nutrition',
    description: 'Nutritional management of acute and chronic pancreatitis',
    modules: 6,
    cme: 9,
    level: 'Advanced',
    duration: '2-3 hours',
    topics: ['Enzyme replacement', 'Fat-soluble vitamins', 'Diabetes management', 'Pain-nutrition relationship']
  },
  {
    id: 'obesity-metabolic',
    title: 'Obesity & Metabolic Syndrome',
    description: 'Comprehensive approach to weight management and metabolic health',
    modules: 9,
    cme: 13,
    level: 'Core',
    duration: '4-5 hours',
    topics: ['Behavioral interventions', 'Pharmacotherapy', 'Bariatric surgery', 'Long-term maintenance']
  },
  {
    id: 'research-methods',
    title: 'Nutrition Research Methods',
    description: 'Critical appraisal and application of nutrition research',
    modules: 5,
    cme: 7,
    level: 'Advanced',
    duration: '2-3 hours',
    topics: ['Study design', 'Statistical analysis', 'Evidence grading', 'Clinical application']
  }
];

export default function DietitianEducation() {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCourses = courses.filter(course => {
    const matchesFilter = selectedFilter === 'All' || course.level === selectedFilter;
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalCME = courses.reduce((sum, course) => sum + course.cme, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">SGA</span>
                </div>
                <span className="text-lg font-semibold text-gray-800">Saudi Gastroenterology Association</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/nursing-education" className="text-gray-600 hover:text-emerald-600 px-3 py-2 rounded-md text-sm font-medium">
                Nursing Education
              </Link>
              <Link href="/fellows-education" className="text-gray-600 hover:text-emerald-600 px-3 py-2 rounded-md text-sm font-medium">
                Fellows Education
              </Link>
              <Link href="/dietitian-education" className="bg-emerald-100 text-emerald-700 px-3 py-2 rounded-md text-sm font-medium">
                Dietitian Education
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white bg-opacity-20 p-4 rounded-2xl">
                <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 10.5 5.16-.76 9-4.95 9-10.5V7L12 2zm-1 16h-2v-2h2v2zm0-4h-2V7h2v7z"/>
                </svg>
              </div>
            </div>
            <h1 className="text-5xl font-bold mb-4">🥗 Dietitian Education Hub</h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Evidence-based nutrition education for gastroenterology dietitians
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="bg-white bg-opacity-20 p-4 rounded-lg">
                <div className="text-2xl font-bold">{courses.length}</div>
                <div className="text-sm">Comprehensive Courses</div>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-lg">
                <div className="text-2xl font-bold">{totalCME}</div>
                <div className="text-sm">Total CME Hours</div>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-lg">
                <div className="text-2xl font-bold">Expert</div>
                <div className="text-sm">Faculty</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filter */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <div className="flex gap-2">
            {['All', 'Core', 'Advanced'].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-4 py-2 rounded-lg font-medium ${
                  selectedFilter === filter
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-emerald-50 border border-gray-200'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Link key={course.id} href={`/dietitian-education/${course.id}`}>
              <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-6 border border-gray-100 h-full">
                <div className="flex items-start justify-between mb-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    course.level === 'Core' 
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {course.level}
                  </span>
                  <div className="text-right text-xs text-gray-500">
                    <div>{course.cme} CME</div>
                    <div>{course.duration}</div>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{course.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-xs text-gray-500">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    {course.modules} modules
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {course.topics.slice(0, 2).map((topic, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      {topic}
                    </span>
                  ))}
                  {course.topics.length > 2 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      +{course.topics.length - 2} more
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 10.5 5.16-.76 9-4.95 9-10.5V7L12 2z"/>
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Footer CTA */}
        <div className="mt-16 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Ready to Advance Your Expertise?</h2>
          <p className="mb-6 max-w-2xl mx-auto">
            Join thousands of dietitians enhancing their gastroenterology nutrition skills through our comprehensive education platform
          </p>
          <div className="flex justify-center gap-4">
            <button className="bg-white text-emerald-600 px-6 py-3 rounded-lg font-semibold hover:bg-emerald-50 transition-colors">
              Start Learning Today
            </button>
            <button className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:bg-opacity-10 transition-colors">
              View All Courses
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
