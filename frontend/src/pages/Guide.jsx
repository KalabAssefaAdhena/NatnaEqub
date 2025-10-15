import { Link } from 'react-router-dom';

export default function Guide() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">📖 How to Use Natna Equb</h1>

      {/* Introduction */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">What is Equb?</h2>
        <p className="mb-2">
          Equb is a traditional Ethiopian saving practice that allows a group of
          people to pool money and take turns receiving the pot. Each member
          contributes a fixed amount at regular intervals. At the end of each
          cycle, a winner is chosen randomly to receive the total contributions
          for that cycle.
        </p>
        <p className="mb-2">
          <strong>Key Points:</strong>
        </p>
        <ul className="list-disc list-inside mb-2">
          <li>Every member contributes the same amount for each cycle.</li>
          <li>
            Each member can only win once until everyone else has received a
            payout.
          </li>
          <li>Equb encourages consistent saving and trust among members.</li>
        </ul>
        <p>
          <strong>Example:</strong> 5 members contribute 100 Birr every week.
          After 5 cycles, each member will have received 500 Birr. This
          structured approach helps members save money while supporting each
          other.
        </p>
      </section>

      {/* Dashboard */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">1. Dashboard & My Equb</h2>
        <p>
          - After logging in, visit the <strong>My Equb</strong> page. Here you
          will see all the groups you have created or joined.
        </p>
        <p>
          - Options include <strong>creating a new group</strong> or{' '}
          <strong>joining an existing group</strong>. Each group shows important
          details like members, contributions, and current cycle status.
        </p>
        <p>
          - Click on a group to see detailed information and manage rotations if
          you are the group manager.
        </p>
      </section>

      {/* Creating and Joining Groups */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          2. Creating & Joining Groups
        </h2>
        <p>
          - <strong>Creating a group:</strong> You become the manager (judge).
          Set the maximum number of members and the contribution amount.
        </p>
        <p>
          - <strong>Joining a group:</strong> Users can send a join request.
          Managers can approve or decline.
        </p>
        <p>
          - <strong>Important:</strong> Once a rotation starts, no new members
          can join. Plan your group size carefully!
        </p>
      </section>

      {/* Rotations and Payouts */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          3. Rotations, Contributions & Payouts
        </h2>
        <p>
          - Each cycle completes only after all members have contributed on
          time. The <strong>group creator</strong> is responsible for ensuring
          everyone pays their share.
        </p>
        <p>
          - The group creator has complete control over the group: they approve
          new members, making sure they trust everyone joining, and monitor
          contributions to maintain smooth rotations.
        </p>
        <p>
          - The winner for each cycle is selected randomly by the system and is
          visible to all group members.
        </p>
        <p>
          - The group creator charges a <strong>service fee</strong> (agreed
          upon by members when joining) for managing the group. Natna Equb
          collects 10% of this service fee from the creator as a platform fee.
        </p>
        <p>
          - Once every member has won once, the rotation ends and the group is
          automatically closed.
        </p>
        <p>
          <strong>Tip:</strong> As a group creator, make sure to track
          contributions and rotation dates carefully, and remind members to pay
          on time to avoid delays.
        </p>
      </section>

      {/* Public Equb */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">4. Public Equb</h2>
        <p>- Public groups are managed by Natna Equb administrators.</p>
        <p>
          - Users can send join requests. Admins approve or decline requests.
          Contribution and rotation logic is the same as private groups.
        </p>
        <p>
          - Public Equbs are useful if you want to join a larger group without
          creating one yourself.
        </p>
      </section>

      {/* Invitations and Requests */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          5. Invitations & Requests
        </h2>
        <p>
          - Use the <strong>Invitations</strong> page to track join requests for
          your groups.
        </p>
        <ul className="list-disc list-inside mb-2">
          <li>Approve or decline join requests.</li>
          <li>Send invitations to friends.</li>
          <li>Track request status: pending, approved, or declined.</li>
        </ul>
      </section>

      {/* Payments */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">6. Payments</h2>
        <p>
          - Contributions and payouts are handled via <strong>Chapa</strong>, a
          secure payment system.
        </p>
        <p>
          - Make sure your bank details are correct to receive payouts without
          issues.
        </p>
        <p>
          - Payment history is visible in your group details so you can track
          contributions and payouts easily.
        </p>
      </section>

      {/* Back Link */}
      <Link
        to="/home/my-equb"
        className="inline-block mt-6 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
      >
        ← Back to Dashboard
      </Link>
    </div>
  );
}
