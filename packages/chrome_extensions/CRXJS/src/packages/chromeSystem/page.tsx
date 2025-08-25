
export default function Page() {
  chrome.system.cpu.getInfo().then((r) => {
    console.log(r, 'cpu');
  });
  return (
    <div className="w-full h-full p-4" >
      <table className="border border-base-content text-xl">
        <tr>
          <th>xxxx</th>
          <td>AAAAA</td>
          <th>BBBB</th>
          <td>CCC</td>
        </tr>
      </table>
    </div>
  );
}
