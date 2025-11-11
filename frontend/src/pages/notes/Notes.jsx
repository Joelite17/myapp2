import { useParams } from "react-router-dom";

export default function NotePage() {
  const { postId } = useParams();

  // Mock note content (Community Medicine)
  const note = {
    id: postId,
    title: "Community Medicine: Key Concepts",
    author: "Dr. Egbeogu",
    time: "2 days ago",
    content: [
      { type: "definition", term: "Primary Health Care (PHC)", desc: "Essential health care accessible to all members of a community." },
      { type: "definition", term: "Epidemiology", desc: "Study of distribution and determinants of health-related states in populations." },
      { type: "bullet", text: "Goals of Community Medicine:" },
      { type: "numbered", items: [
        "Promote health and prevent disease.",
        "Protect populations from environmental hazards.",
        "Provide equitable access to health care.",
        "Monitor and evaluate health programs."
      ]},
      { type: "bullet", text: "Important Strategies:" },
      { type: "numbered", items: [
        "Health education",
        "Vaccination programs",
        "Environmental sanitation",
        "Screening and early detection"
      ]},
      { type: "bullet", text: "Key Indicators:" },
      { type: "bullet", text: "Infant mortality rate, maternal mortality ratio, immunization coverage, prevalence of communicable diseases" }
    ]
  };

  return (
    <div className="flex justify-center w-full min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="w-full lg:w-4/6 space-y-4 py-6 px-4 bg-white dark:bg-gray-800 shadow-md rounded-lg transition-colors duration-300">
        <h1 className="text-2xl font-bold mb-2">{note.title}</h1>

        <div className="prose dark:prose-invert max-w-full">
          {note.content.map((item, idx) => {
            if (item.type === "definition") {
              return (
                <p key={idx}>
                  <span className="font-semibold">{item.term}:</span> {item.desc}
                </p>
              );
            }
            if (item.type === "bullet") {
              return (
                <ul key={idx} className="list-disc ml-6 mb-2">
                  <li>{item.text}</li>
                </ul>
              );
            }
            if (item.type === "numbered") {
              return (
                <ol key={idx} className="list-decimal ml-6 mb-2">
                  {item.items.map((numItem, i) => (
                    <li key={i}>{numItem}</li>
                  ))}
                </ol>
              );
            }
            return null;
          })}
        </div>
      </div>
    </div>
  );
}
