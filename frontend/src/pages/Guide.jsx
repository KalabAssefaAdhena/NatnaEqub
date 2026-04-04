import { Link } from "react-router-dom";

export default function Guide() {
  return (
    <div className="min-h-screen max-w-3xl mx-auto px-4 sm:px-6 md:px-10 py-8 space-y-6">
      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white text-center">
        📖 How to Use Natna Equb
      </h1>

      {/* Sections Container */}
      <div className="space-y-6">
        {/* Introduction */}
        <section className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
            What is Equb?
          </h2>

          <p className="mb-2 text-gray-700 dark:text-gray-300">
            Equb is a traditional Ethiopian saving practice that allows a group
            of people to pool money and take turns receiving the pot. Each
            member contributes a fixed amount at regular intervals. At the end
            of each cycle, a winner is chosen randomly to receive the total
            contributions for that cycle.
          </p>

          <p className="mb-2 text-gray-700 dark:text-gray-300">
            <strong>Key Points:</strong>
          </p>

          <ul className="list-disc list-inside mb-2 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Every member contributes the same amount for each cycle.</li>
            <li>
              Each member can only win once until everyone else has received a
              payout.
            </li>
            <li>Equb encourages consistent saving and trust among members.</li>
          </ul>

          <p className="text-gray-700 dark:text-gray-300">
            <strong>Example:</strong> 5 members contribute 100 Birr every week.
            After 5 cycles, each member will have received 500 Birr. This
            structured approach helps members save money while supporting each
            other.
          </p>
        </section>

        {/* Dashboard */}
        <section className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
            1. Dashboard & My Equb
          </h2>

          <p className="text-gray-700 dark:text-gray-300">
            - After logging in, visit the <strong>My Equb</strong> page. Here
            you will see all the groups you have created or joined.
          </p>

          <p className="text-gray-700 dark:text-gray-300">
            - Options include <strong>creating a new group</strong> or{" "}
            <strong>joining an existing group</strong>. Each group shows
            important details like members, contributions, and current cycle
            status.
          </p>

          <p className="text-gray-700 dark:text-gray-300">
            - Click on a group to see detailed information and manage rotations
            if you are the group manager.
          </p>
        </section>

        {/* Creating & Joining */}
        <section className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
            2. Creating & Joining Groups
          </h2>

          <p className="text-gray-700 dark:text-gray-300">
            - <strong>Creating a group:</strong> You become the manager (judge).
            Set the maximum number of members and the contribution amount.
          </p>

          <p className="text-gray-700 dark:text-gray-300">
            - <strong>Joining a group:</strong> Users can send a join request.
            Managers can approve or decline.
          </p>

          <p className="text-gray-700 dark:text-gray-300">
            - <strong>Important:</strong> Once a rotation starts, no new members
            can join. Plan your group size carefully!
          </p>
        </section>

        {/* Rotations */}
        <section className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
            3. Rotations, Contributions & Payouts
          </h2>

          <p className="text-gray-700 dark:text-gray-300">
            - Each cycle completes only after all members have contributed on
            time. The <strong>group creator</strong> is responsible for ensuring
            everyone pays their share.
          </p>

          <p className="text-gray-700 dark:text-gray-300">
            - The group creator has complete control over the group: they
            approve new members, making sure they trust everyone joining, and
            monitor contributions to maintain smooth rotations.
          </p>

          <p className="text-gray-700 dark:text-gray-300">
            - The winner for each cycle is selected randomly by the system and
            is visible to all group members.
          </p>

          <p className="text-gray-700 dark:text-gray-300">
            - The group creator charges a <strong>service fee</strong> (agreed
            upon by members when joining) for managing the group. Natna Equb
            collects 10% of this service fee from the creator as a platform fee.
          </p>

          <p className="text-gray-700 dark:text-gray-300">
            - Once every member has won once, the rotation ends and the group is
            automatically closed.
          </p>

          <p className="text-gray-700 dark:text-gray-300">
            <strong>Tip:</strong> As a group creator, make sure to track
            contributions and rotation dates carefully, and remind members to
            pay on time to avoid delays.
          </p>
        </section>

        {/* Public Equb */}
        <section className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
            4. Public Equb
          </h2>

          <p className="text-gray-700 dark:text-gray-300">
            - Public groups are managed by Natna Equb administrators.
          </p>

          <p className="text-gray-700 dark:text-gray-300">
            - Users can send join requests. Admins approve or decline requests.
            Contribution and rotation logic is the same as private groups.
          </p>

          <p className="text-gray-700 dark:text-gray-300">
            - Public Equbs are useful if you want to join a larger group without
            creating one yourself.
          </p>
        </section>

        {/* Invitations */}
        <section className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
            5. Invitations & Requests
          </h2>

          <p className="text-gray-700 dark:text-gray-300">
            - Use the <strong>Invitations</strong> page to track join requests
            for your groups.
          </p>

          <ul className="list-disc list-inside mb-2 text-gray-700 dark:text-gray-300 space-y-1">
            <li>Approve or decline join requests.</li>
            <li>Send invitations to friends.</li>
            <li>Track request status: pending, approved, or declined.</li>
          </ul>
        </section>

        {/* Payments */}
        <section className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
            6. Payments
          </h2>

          <p className="text-gray-700 dark:text-gray-300">
            - Contributions and payouts are handled via <strong>Chapa</strong>,
            a secure payment system.
          </p>

          <p className="text-gray-700 dark:text-gray-300">
            - Make sure your bank details are correct to receive payouts without
            issues.
          </p>

          <p className="text-gray-700 dark:text-gray-300">
            - Payment history is visible in your group details so you can track
            contributions and payouts easily.
          </p>
        </section>
      </div>

    
      
    </div>
  );
}
